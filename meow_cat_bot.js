var maxLoop = 5;
var lastTweetFileName = "meow_cat_bot_last_tweet";
var logFileName = "meow_cat_bot";
var currentWorkingDirectory = "c:\\Users\\ARebel\\Dropbox\\imacros\\macros\\meow_cat_bot";

var nl = "\n";

var macro = "CODE:";

macro += "TAB T=1" + nl;
macro += "URL GOTO=https://twitter.com/search?f=tweets&vertical=default&q=%23meow&src=typd" + nl;
iimPlay(macro);

// We then check if we have a data in the lastTweet log
macro = "CODE:";
macro += "SET !FOLDER_DATASOURCE " + currentWorkingDirectory + nl;
macro += "SET !ERRORIGNORE YES" + nl;
macro += "SET !DATASOURCE " + lastTweetFileName + ".csv" + nl;
macro += "SET !DATASOURCE_LINE 1" + nl;
macro += "SET !EXTRACT {{!COL1}}" + nl;
macro += "SET !ERRORIGNORE NO" + nl;
iimPlay(macro);
var lastTweet = iimGetExtract(1);

for ( currentLoop = 0 ; currentLoop < maxLoop ; currentLoop++) {
    macro = "CODE:";
    macro += "SET currentLoop " + (currentLoop+1) + nl;
    macro += "TAG POS={{currentLoop}} TYPE=SPAN ATTR=class:username<SP>js-action-profile-name* EXTRACT=TXT" + nl;
    macro += "TAG POS={{currentLoop}} TYPE=DIV ATTR=class:tweet*js-actionable-tweet* EXTRACT=TXT" + nl;

    // We get the URL of the tweet
    macro += "SET !EXTRACT NULL" + nl;
    macro += "TAG POS=R1 TYPE=A ATTR=class:tweet-timestamp* EXTRACT=HREF" + nl;
    macro += "SET tweetUrl {{!EXTRACT}}" + nl;
    iimPlay(macro);

    // If we detect a tweet that we already processed, end the program
    var tweetUrl = iimGetExtract(1);
    if ( tweetUrl == lastTweet ) {
        iimDisplay("Processed up until tweet #" + currentLoop + ". Reached a tweet that was already processed: " + tweetUrl);
        break;
    }

    iimDisplay(tweetUrl + " ?= " + lastTweet);
    iimSet("tweetUrl", tweetUrl);
    iimSet("currentLoop", (currentLoop+1));

    // We continue with the program.
    macro = "CODE:";
    macro += "TAG POS={{currentLoop}} TYPE=DIV ATTR=class:tweet*js-actionable-tweet* EXTRACT=TXT" + nl;
    macro += "SET !EXTRACT NULL" + nl;

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
    macro += "TAG POS=1 TYPE=BUTTON ATTR=class:btn*tweet-action*tweet-btn" + nl;

    macro += "SET !EXTRACT NULL" + nl;
    macro += "ADD !EXTRACT {{!NOW:yyyy-mm-dd<SP>hhh<SP>nnmin}}" + nl;
    macro += "ADD !EXTRACT {{tweetUrl}}" + nl;

    macro += "SAVEAS TYPE=EXTRACT FOLDER=" + currentWorkingDirectory + " FILE=" + logFileName + ".csv" + nl;

    if ( currentLoop <= 0 ) {
        // Delete the lastTweetFile if it exists
        if ( lastTweet != null ) 
            macro += "FILEDELETE NAME=" + currentWorkingDirectory + "\\" + lastTweetFileName + ".csv" + nl;

        macro += "SET !EXTRACT {{tweetUrl}}" + nl;
        macro += "SAVEAS TYPE=EXTRACT FOLDER=" + currentWorkingDirectory + " FILE=" + lastTweetFileName + ".csv" + nl;
    }

    macro += "WAIT SECONDS=6" + nl;
    iimPlay(macro);
}

macro = "CODE:";
macro += "TAB CLOSEALLOTHERS" + nl;
macro += "TAB T=1" + nl;
macro += "TAB CLOSE" + nl;

iimPlay(macro);
