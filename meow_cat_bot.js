var maxLoop = 5;
var lastTweetFileName = "meow_cat_bot_last_tweet";
var logFileName = "meow_cat_bot";

var nl = "\n";

var macro = "CODE:";

macro += "TAB T=1" + nl;
macro += "URL GOTO=https://twitter.com/search?f=tweets&vertical=default&q=%23meow&src=typd" + nl;
macro += "FILEDELETE NAME=" + lastTweetFileName + ".csv" + nl;
iimPlay(macro);

for ( currentLoop = 0 ; currentLoop < maxLoop ; currentLoop++) {
    macro = "CODE:";
    macro += "SET currentLoop " + (currentLoop+1) + nl;
    macro += "TAG POS={{currentLoop}} TYPE=SPAN ATTR=class:username<SP>js-action-profile-name* EXTRACT=TXT" + nl;
    macro += "TAG POS={{currentLoop}} TYPE=DIV ATTR=class:tweet*js-actionable-tweet* EXTRACT=TXT" + nl;

    // We get the URL of the tweet
    macro += "SET !EXTRACT NULL" + nl;
    macro += "TAG POS=R1 TYPE=A ATTR=class:tweet-timestamp* EXTRACT=HREF" + nl;
    macro += "SET tweetUrl {{!EXTRACT}}" + nl;

    // We click on the reply button
    macro += "TAG POS=R1 TYPE=BUTTON ATTR=class:ProfileTweet-actionButton*" + nl;
    macro += "WAIT SECONDS=2" + nl;

    // We randomize our message
    var messages = [
        "Meow,<SP>meow,<SP>meow!",
        "Meow!",
        "Meow,<SP>meow?",
        "Mmmmm...eow."
    ];
    var rolledMessage = messages[Math.floor(Math.random() * messages.length)];

    // We type our message
    macro += "EVENT TYPE=CLICK SELECTOR=#tweet-box-global BUTTON=0" + nl;
    macro += "EVENTS TYPE=KEYPRESS SELECTOR=#tweet-box-global CHARS=" + rolledMessage + "<SP>#IAmABot" + nl;

    macro += "WAIT SECONDS=3" + nl;

    // We click on the submit button
    // macro += "TAG POS=1 TYPE=BUTTON ATTR=class:btn*tweet-action*tweet-btn" + nl;

    macro += "SET !EXTRACT NULL" + nl;
    macro += "ADD !EXTRACT {{!NOW:yyyy-mm-dd<SP>hhh<SP>nnmin}}" + nl;
    macro += "ADD !EXTRACT {{tweetUrl}}" + nl;

    macro += "SAVEAS TYPE=EXTRACT FOLDER=* FILE=" + logFileName + ".csv" + nl;

    if ( currentLoop >= maxLoop - 1 ) {
        macro += "SET !EXTRACT {{tweetUrl}}" + nl;
        macro += "SAVEAS TYPE=EXTRACT FOLDER=* FILE=" + lastTweetFileName + ".csv" + nl;
    }

    macro += "WAIT SECONDS=6" + nl;
    iimPlay(macro);
}

macro = "CODE:";
macro += "TAB CLOSEALLOTHERS" + nl;
macro += "TAB T=1" + nl;
macro += "TAB CLOSE" + nl;

// iimPlay(macro);
