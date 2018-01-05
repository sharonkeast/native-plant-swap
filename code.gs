function doGet(e) {
  return HtmlService
      .createTemplateFromFile('Page')
      .evaluate();
}
/**
 * Get posts
 * @returns Object[][] — a two-dimensional array of values or [] - null
 */
function getPostsData() {
  var pdata = SpreadsheetApp
      .openById('12345678901234567890123456789012345678901234')
      .getSheets()[0]
      .getDataRange()
      .getValues();
  return pdata;
}

/**
 * Send the Message
 * @param {String} Response ID from Posts spreadsheet
 * @return {String} Email address and edit URL from Form
 */
function sendMessage(rid, bod) {
  var form          = FormApp.openById('12345678901231234567890456789012345678901234');
  var formResponses = form.getResponses();
  for (var i = 0; i < formResponses.length; i++) {
     var formResponse  = formResponses[i];  
     if ( rid == formResponse.getId() ) {
        var fURL          = formResponse.getEditResponseUrl();
        var fEmailAddress = formResponse.getRespondentEmail();     
        var LogoUrl       = "https://www.your-domain.com/yourlogo.png";
        var LogoBlob      = UrlFetchApp
                               .fetch(LogoUrl)
                               .getBlob()
                               .setName("LogoBlob");
        MailApp.sendEmail({
            to: fEmailAddress,
            subject: "Native Plant Swap: Response to your post",
            htmlBody: bod + 
       "Use <a href='" + fURL + "'>this link</a>  to edit or delete your listing.<br><br>" +
       "<br><img height='50' src='cid:Logo'><br>" + 
       "Your Organization<br>" + 
       "nativeplantswap@your-domain.com<br>" +
       "(123) 456-7890",
            inlineImages: {
               Logo: LogoBlob
            }
       });
       return;
      };
   };
   Logger.log("No Response ID match found, email not sent");
   return;
}
