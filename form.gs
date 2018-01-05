function myFunction(e) {

 var PostsSheet       = "12345678901234567890123456789012345678901234";
 var fResponseID      = e.response.getId();
 var fItemResponses   = e.response.getItemResponses();
 var fTimestamp       = e.response.getTimestamp();
 var formattedDate    = dateToString(fTimestamp);
 var fItemResponse    = "";
 var fItemTitle       = "";
 var fItemAnswer      = "";
 var fPost            = "";
 var deletePost       = false;
 var newPost          = true;

// Get the Form response
 for (var j = 0; j < fItemResponses.length; j++) {
    fItemResponse  = fItemResponses[j];
    fItemTitle     = fItemResponse.getItem().getTitle();
    fItemAnswer    = fItemResponse.getResponse();
    Logger.log("Form item: TITLE = " + fItemTitle + ", RESPONSE = " + fItemAnswer);
    if ( fItemTitle == "Your Post" ) {
       fPost = fItemAnswer;
    }
    else {
       if ( fItemTitle == "Delete Your Post" && fItemAnswer == "DELETE" ) {
          Logger.log("DELETE was checked on the form");
          deletePost = true;
       }
    }
 };

// Update Posts spreadsheet 
 var postsSS         = SpreadsheetApp.openById(PostsSheet);    
 var psheet          = postsSS.getSheets()[0];
 var pvalues         = psheet.getDataRange().getValues();
 Logger.log("updatePost ..."); 
 
 for (var p = 0; p < pvalues.length; p++) {
    if ( pvalues[p][0] == fResponseID) {
       Logger.log("Match on response ID found in Posts spreadsheet");
       if ( deletePost == true ) {
          Logger.log("Deleting Posts spreadsheet row");
          psheet.deleteRow(p+1);
          return;
       }
       Logger.log("Updating Posts spreadsheet row");
       psheet.getRange(p+1,2).setValue(fPost);
       psheet.getRange(p+1,3).setValue(formattedDate);
       return;
    };
 }
 Logger.log("Response ID not found");
 if ( deletePost == true ) {
    Logger.log("Delete post - do nothing");
    return;
 };
 Logger.log("Adding a row");
 psheet.appendRow([fResponseID, fPost, formattedDate]);
 }

// Format timestamp to a text string 
function dateToString(d) {
   var D = d.getDate().toString().replace(/^(\d)$/, '0$1');
   var M = (d.getMonth() + 1).toString().replace(/^(\d)$/, '0$1');
   var Y = d.getFullYear();
return 'Posted: ' + Y + '/' + M + '/' + D;    
}
