// ModalHandler.js

// ModalHandler
//-----------------------------------------------------------------------------------

// Class handles functionality related to modals in the reporting section

var ModalHandler = function() {};

ModalHandler.prototype.unselectedColor = "transparent";
ModalHandler.prototype.selectedColor = "rgb(149, 206, 226)";


// Returns all selectable items in the current modal
ModalHandler.prototype.getSelectable = function(htmlDoc) {
	return htmlDoc.getElementsByClassName("selectable");
};

// Resets all selectable backgrounds
ModalHandler.prototype.resetSelectableBackgrounds = function(htmlDoc) {
	var divArray = this.getSelectable(htmlDoc);
	for(var i = 0; i < divArray.length; i++)
	{
		divArray[i].style.backgroundColor = this.unselectedColor;
	}
};

// Sets a new temporary (unsaved) selection on a modal
ModalHandler.prototype.setNewTempSelection = function(htmlDoc, modal, id) {
	var selectedElement = htmlDoc.getElementById(id);
	if((modal.temp && modal.temp === id) || (modal.selection && modal.selection === id))
	{
		modal.temp = "";
		selectedElement.style.backgroundColor = this.unselectedColor;
	}
	else
	{
        // Reset old background (if necessary)
        if(modal.temp && modal.temp !== "")
        {
            htmlDoc.getElementById(modal.temp).style.backgroundColor = this.unselectedColor;
        }        
        
        // Save temp selection
        modal.temp = id;
        
        // Update ui to new selection
		selectedElement.style.backgroundColor = this.selectedColor;
	}
};

// Sets up any previsouly selected items from a modal
ModalHandler.prototype.setPreviousSelection = function(htmlDoc, id) {
    if(id !== "")
    {
        htmlDoc.getElementById(id).style.backgroundColor = this.selectedColor;
    }
};

// Opens a modal and handles setting up any selectable items
ModalHandler.prototype.openModal = function(htmlDoc, modal)
{
    if(modal.selection)
    {
        this.setPreviousSelection(htmlDoc, modal.selection);
    }
    else
    {
        this.resetSelectableBackgrounds(htmlDoc);
    }
    modal.show();
};

// Saves the specified modal
ModalHandler.prototype.saveModal = function(htmlDoc, modal, summaryElementId, convertFunction, formatSummaryText, summaryDifferent) {
    modal.selection = modal.temp;
    var reportField = convertFunction(modal.selection);
    var summary = htmlDoc.getElementById(summaryElementId);
    if(summaryDifferent)
    {
        summary.innerText = formatSummaryText(reportField);
    }
    else
    {
        if(reportField && reportField !== "")
        {
            summary.innerText = formatSummaryText(reportField);
        }
        else
        {
            summary.innerText = "______";
        }
    }
    
    
    modal.hide();
    
};