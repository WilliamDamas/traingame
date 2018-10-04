$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyCjcnP9crYZ3C2cSBrvIEPjk8gFnDMP5C0",
        authDomain: "trainscheduler-980d4.firebaseapp.com",
        databaseURL: "https://trainscheduler-980d4.firebaseio.com",
        storageBucket: "trainscheduler-980d4.appspot.com",
        messagingSenderId: "754858838432"
    };
    firebase.initializeApp(config);


    database = firebase.database();


    var trainName = '';
    var dest = '';
    var firstTrainTime = '';
    var freq = '';


    var firstTimeConverted = '';
    var diffTime = '';
    var tRemainder;
    var tMinutesTillTrain;
    var nextTrain;


    var trainNameData = '';
    var destData = '';
    var arrivalData = '';
    var freqData = '';
    var minutesAwayData = '';


    $('#submit').on('click', function (event) {
        event.preventDefault();

        trainName = $('#trainName').val().trim();
        dest = $('#dest').val().trim();
        firstTrainTime = $('#firstTrainTime').val().trim();
        freq = $('#freq').val().trim();


        $('#trainName').val('');
        $('#dest').val('');
        $('#firstTrainTime').val('');
        $('#freq').val('');


        firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");

        var currentTime = moment();
        diffTime = moment().diff(moment(firstTimeConverted), "minutes");


        tRemainder = diffTime % freq;


        tMinutesTillTrain = freq - tRemainder;


        nextTrain = moment().add(tMinutesTillTrain, "minutes");
        nextTrainFormat = moment(nextTrain).format('hh:mm');

        database.ref('/trainSchedule').push({
            trainName: trainName,
            destination: dest,
            arrival: nextTrainFormat,
            minutesAway: tMinutesTillTrain,
            frequency: freq
        });
    });

    database.ref('/trainSchedule').on('child_added', function (snap) {

        trainNameData = snap.val().trainName;
        destData = snap.val().destination;
        arrivalData = snap.val().arrival;
        freqData = snap.val().frequency;
        minutesAwayData = snap.val().minutesAway;


        var dataArray = [trainNameData, destData, freqData, arrivalData, minutesAwayData];
        var newTr = $('<tr>');
        for (var i = 0; i < dataArray.length; i++) {
            var newTd = $('<td>');
            newTd.text(dataArray[i]);
            newTd.appendTo(newTr);
        }
        $('.table').append(newTr);
    });
});