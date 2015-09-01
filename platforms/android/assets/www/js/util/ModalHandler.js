// ModalHandler.js

/**
 * @class ModalHandler
 * @constructor
 */

// ModalHandler
//-----------------------------------------------------------------------------------

// Class handles functionality related to modals in the reporting section
// Empty constructor
var ModalHandler = function() {};

/**
 * Static unselected color value
 * 
 * @property unselectedColor
 * @type string
 * @default "transparent"
 */

// Static unselected color value
ModalHandler.prototype.unselectedColor = "transparent";

/**
 * Static selected color value
 * 
 * @property selectedColor
 * @type string
 * @default "rgb(149, 206, 226)"
 */

// Static selected color value
ModalHandler.prototype.selectedColor = "rgb(149, 206, 226)";

/**
 * @method getSelectable
 * @description Returns all "selectable" items in the current modal, determined by class
 * @param {HTML Document} htmlDoc The "document" variable from the current scope
 * @return {array} An array of all the elements in the current ui that are members
 *          of the "selectable" class.  This should be used for situations when the
 *          user selects from multiple pre-defined options listed as a grid of icons.
 * @throws none
 */

// Returns all "selectable" items in the current modal, determined by class
ModalHandler.prototype.getSelectable = function(htmlDoc) {
	return htmlDoc.getElementsByClassName("selectable");
};

/**
 * @method resetSelectableBackgrounds
 * @description
 * @param {HTML Document} htmlDoc The "document" variable from the current scope
 * @return void
 * @throws none
 */

// Resets (changes to the unselected color) all the backgrounds of elements that are members of the
// "selectable class"
ModalHandler.prototype.resetSelectableBackgrounds = function(htmlDoc) {
	var divArray = this.getSelectable(htmlDoc);
	for(var i = 0; i < divArray.length; i++)
	{
		divArray[i].style.backgroundColor = this.unselectedColor;
	}
};

/**
 * @method setNewTempSelection
 * @description
 * @param {HTML Document} htmlDoc The "document" variable from the current scope
 * @param {ionicModal} modal The app modal that the selection was performed on
 * @param {string} id The id of the element that was selected.
 */

// Sets a new temporary (unsaved) selection on a modal.  Handles background recoloring.
ModalHandler.prototype.setNewTempSelection = function(htmlDoc, modal, id) {
    // Grab the selected element
	var selectedElement = htmlDoc.getElementById(id);
    
    // Check previous selections (temporary or saved)
	if((modal.temp && modal.temp === id) || (modal.selection && modal.selection === id))
	{
        // If selectedElement is the same as the previously selected element, deselect it
		modal.temp = "";
		selectedElement.style.backgroundColor = this.unselectedColor;
	}
	else
	{
        // If any other element was previously (temporarily) selected, reset its background color
        if(modal.temp && modal.temp !== "")
        {
            htmlDoc.getElementById(modal.temp).style.backgroundColor = this.unselectedColor;
        }        
        
        // Save new temp selection
        modal.temp = id;
        
        // Update ui to new selected item
		selectedElement.style.backgroundColor = this.selectedColor;
	}
};

/**
 * @method setPreviousSelection
 * @description
 * @param {HTML Document} htmlDoc The "document" variable from the current scope
 * @param {string} id The id of any previously selected element
 * @return void
 * @throws none
 */

// Sets up any previsouly selected items from a modal (sets the background of the element indicated by "id" to
// the selected color).
ModalHandler.prototype.setPreviousSelection = function(htmlDoc, id) {
    // If the id is valid...
    if(id !== "")
    {
        // Set background color to "selected"
        htmlDoc.getElementById(id).style.backgroundColor = this.selectedColor;
    }
};

/**
 * @method openModal
 * @description
 * @param {HTML Document} htmlDoc the "document" variable from the current scope
 * @param {ionicModal} The app modal to be opened.
 * @return void
 * @throws none
 */

// Opens a modal and handles setting up any selectable items
ModalHandler.prototype.openModal = function(htmlDoc, modal)
{
    // Actually display the modal (to create the html elements if they are not already created)
    modal.show();
    
    // If anything was previously selected...
    if(modal.selection)
    {
        // Reset all backgrounds
        this.resetSelectableBackgrounds(htmlDoc);
        
        // Set the selected value background
        this.setPreviousSelection(htmlDoc, modal.selection);
        
        // Set as new temp selection
        modal.temp = modal.selection;
    }
    else
    {
        // Otherwise, clear all backgrounds to the unselected color (takes care of any un-recycled view elements)
        this.resetSelectableBackgrounds(htmlDoc);
    }   
};
  
/**
 * @method saveModal
 * @param {HTML Document} htmlDoc The "document" variable from the current scope.
 * @param {ionicModal} modal The modal to save.
 * @param {string} summaryElementId The id of the element to display the summary information in
 * @param {function} convertFunction The function that specifies how to convert the selected element id (in modal.temp)
 *          to the actual report value.
 * @param {function} formatSummaryText The function that handles formatting the summary field
 * @param {boolean} summaryDifferent OPTIONAL parameter that indicates whether the summary field should be different from
 *          what was saved into the report.
 */

// Performs "Save" functionality for the specified modal.
ModalHandler.prototype.saveModal = function(htmlDoc, modal, summaryElementId, convertFunction, formatSummaryText, summaryDifferent) {
    // Save the selection to the modal permanent variable
    modal.selection = modal.temp;
    
    // Update the reportField with the passed formatting funcion
    var reportField = convertFunction(modal.selection);
    
    // Grab a reference to the summary element
    var summary = htmlDoc.getElementById(summaryElementId);
    
    // If the summary is flagged as different than the reportField value...
    if(summaryDifferent)
    {
        // Set it with its own provided formatting function
        summary.innerText = formatSummaryText(reportField);
    }
    else
    {
        // Otherwise, set the summary text to the same as the report field
        if(reportField && reportField !== "")
        {
            summary.innerText = reportField;
        }
        else
        {
            // If no value was selected, re-display the blank "_____" that indicates no value selected
            summary.innerText = "______";
        }
    }
    
    // Hide the modal
    modal.hide();
    
};