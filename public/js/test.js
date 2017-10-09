$(function () {
    $('#addtopic').submit(function(e) {
        e.preventDefault();
        var lectureId = $('#lecturID').val();
        var topicName = $('#topicName').val();

        if(topicName.length < 1) {
            alert("Please insert a valid topic name");
            return;
        }

        $.ajax(
            {
                type: 'POST',
                url: 'http://localhost:1993/adminhome/lecturedetails:1',
                data: {
                    lectureID: lectureId,
                    topicName: topicName
                },
                dataType: 'json',
                success: function (response) {
                    $('#topicName').val('');
                    var newTopic = "<tr><td>" + topicName + "</td><td> Enabled </td></tr>";
                    $('#topicsTable').append(newTopic);
                }
            }
        );
    });

    var socket = io.connect();
    // socket.on('connect', function () {
    //    alert("connected");
    //     io.sockets.emit('send data', {'lectureID':lectureID, 'topicID':topicId});
    // });

    $("#startstop").click(function () {
        var lectureID = $('#lectureID').val();

        $.ajax(
            {
                type: 'POST',
                url: 'http://localhost:1993/adminhome/startstoplecture',
                data: {
                    lectureID: lectureID,
                },
                dataType: 'json',
                success: function (response) {
                    if(response.started){
                        $("#startstop").text("Started");
                        $("#startstop").removeClass("btn-info");
                        $("#startstop").removeClass("btn-danger");
                        $("#startstop").addClass("btn-success");
                        swal("", "Lecture has been started!", "success", {
                            button: "Ok!",
                        });
                        return;
                    } else {
                        $("#startstop").text("Stroped");
                        $("#startstop").removeClass("btn-info");
                        $("#startstop").removeClass("btn-success");
                        $("#startstop").addClass("btn-danger");
                        swal("", "Lecture has been stoped!", "error", {
                            button: "Ok!",
                        });
                        return;
                    }
                }
            }
        );
    });

    $("label").click(function(){
        $(this).parent().find("label").css({"background-color": "#D8D8D8"});
        $(this).css({"background-color": "#FD4"});
        $(this).nextAll().css({"background-color": "#FD4"});

        var lectureID = $('#lectureID').val();
        var topicId = this.getAttribute('topic-id');
        var value = this.getAttribute('value');


        $.ajax(
            {
                type: 'POST',
                url: 'http://localhost:1993/userhome/postratting',
                data: {
                    lectureID: lectureID,
                    topicID: topicId,
                    value: value
                },
                dataType: 'json',
                success: function (response) {
                    swal("Thank You!", "Your rating has been saved!", "success", {
                        button: "Ok!",
                    });
                }
            }
        );

        socket.emit('send data', {'lectureID':lectureID, 'topicID':topicId});

    });

});