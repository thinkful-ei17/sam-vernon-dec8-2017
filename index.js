'use strict';

const STORE = [
  {name: 'apples', checked: false, edit: false},
  {name: 'oranges', checked: false, edit: false},
  {name: 'milk', checked: true, edit: false},
  {name: 'bread', checked: false, edit: false}
];


function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
    ${item.edit ?
      
    `<form id="js-shopping-update">
      <input type="text" value=${item.name} name="shopping-edit-entry" class="js-shopping-edit-entry" />
      <button type="submit">Update</button>
      </form>`
    :
    `<span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>`}

      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>
    `;
}


function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item, index) => generateItemElement(item, index));

  return items.join('');
}


function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(STORE);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.push({name: itemName, checked: false, edit: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE[itemIndex].checked = !STORE[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function deleteSelectedItem(array, index){
  console.log(`deleteSelectedItem has been clicked at ${index}`);
  array.splice(index, 1);
}

function handleDeleteItemClicked() {
  // this function will be responsible for when users want to delete a shopping list
  // item

  //listener checks for click on js item delete
  // line 96-97

  $('.js-shopping-list').on('click','.js-item-delete', function(event){
    console.log('`handleDeleteItemClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteSelectedItem(STORE, itemIndex);
    renderShoppingList();
  });

  //get itemindex; which item we clicked
  // already defined in line 68-73 called at line 98

  //remove selected item -
  //    //arr.splice(itemIndex, 1);
  // line 84-86 called at line 99

  // theres a change to our "STORE"
  //have2call renderShoppingList
  // line 36 called at line 100

}

function updateItem(array, index, updatedName){
  array[index].name = updatedName;
}

function handleEditInputSubmit() {
  $('.js-shopping-list').on('submit','#js-shopping-update', function(event){
    event.preventDefault();
    console.log('`handleEditInputSubmit` ran');
    const updatedItemName = $('.js-shopping-edit-entry').val();
    console.log(`The updated value is ${updatedItemName}`);
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    console.log(`The index is ${itemIndex}`);
    updateItem(STORE, itemIndex, updatedItemName);
    toggleEditKey(STORE, itemIndex);
    renderShoppingList();
  });
}

function toggleEditKey(array, index){
  array[index].edit = !array[index].edit;
}

function handleEditItemClicked(index) {
  // User can edit an item title

  // User clicks item name
  $('.js-shopping-list').on('click','.js-shopping-item', function(event){
    console.log('handleEditItemClicked ran');
    // Generates an input bar in place of item name with value set to item name and an update item button next to input bar -- Re-render shopping list, change input(our key) to true
    //edited the generateItemElement + added edit key
    //toggleEditkey
    const itemIndex = getItemIndexFromElement(event.currentTarget);

    toggleEditKey(STORE,itemIndex);
    // User is able to edit value

    // User can submit input

    // Re-render shopping list with input value as new Item Name, input bar and button turned off
    renderShoppingList();
  });

}



// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleEditItemClicked();
  handleEditInputSubmit();
  handleDeleteItemClicked();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);
