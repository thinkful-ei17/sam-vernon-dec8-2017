'use strict';

const STORE = [
  {name: 'apples', checked: false, edit: false, index: 0 },
  {name: 'oranges', checked: false, edit: false, index: 1},
  {name: 'milk', checked: true, edit: false, index: 2},
  {name: 'bread', checked: false, edit: false, index: 3}
];

const DATABASE = {
  items : STORE ,
  hideChecked : false ,
  search : ""
};

//added index key to STORE, everytime something is added/deleted to the STORE
//index for each obj is changed with resetIndex
//resetIndex is not called when hidding or searching for a key. their place in STORE is not changed. a key for them is.
//
//generateItemElement was changed; itemIndex that was passed in to item.index
//generateShoppingItemsString was changed; map no longer decides index of item
//new function filterSearchKey, filters out STORE to get only the object with specific search key
//to get orig view back user has to search nothing. 
function resetIndex(data) {
  let counter = 0;
  data.forEach(function(n) {
    n.index = counter++;
  });

}

function generateItemElement(item, data, template) {
  return `
    <li class="js-item-index-element ${data.hideChecked && item.checked ? 'hidden' : ''}" data-item-index="${item.index}">
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

function filterSearchKey (items, data) {
  let searchArr = items.filter(function (item) {
    return item.name === data.search;
  });

  return searchArr;
}

function generateShoppingItemsString(shoppingList, data) {
  console.log('Generating shopping list element');
  //if hideChecked == true
  //    filter
  //

  const list = shoppingList.map((item) => generateItemElement(item, data));

  return list.join('');
}


function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  let shoppingListItemsString = "";

  if (DATABASE.search !== "") {
    console.log("database-rendershoppingList if is triggered");
    let searchArr = filterSearchKey(STORE, DATABASE);
    shoppingListItemsString = generateShoppingItemsString(searchArr, DATABASE);
   }

   else {
     console.log("regular-rendershoppingList is triggered");
     shoppingListItemsString = generateShoppingItemsString(STORE, DATABASE);
   }

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.push({name: itemName, checked: false, edit: false, index: 0});
  resetIndex(STORE);
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    resetIndex(STORE);
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
  $('.js-shopping-list').on('click','.js-item-delete', function(event){
    console.log('`handleDeleteItemClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteSelectedItem(STORE, itemIndex);
    resetIndex(STORE);
    renderShoppingList();
  });
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

  $('.js-shopping-list').on('click','.js-shopping-item', function(event){
    console.log('handleEditItemClicked ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleEditKey(STORE,itemIndex);
    renderShoppingList();
  });

}

function toggleFilter(data) {
  data.hideChecked = !data.hideChecked;
}

function handleFilterClick(){
  $('#js-filter').click(function(event){
    console.log('The filter has been clicked');
    toggleFilter(DATABASE);
    renderShoppingList();
  });
}

function toggleSearch(data, itemName) {
  data.search = itemName;
  console.log(data.search);
}
function handleSearchBar() {
  $('#js-search-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleSearchBar` ran');
    const searchItemName = $('.js-shopping-list-search').val();
    toggleSearch(DATABASE, searchItemName);
    //filter items
      //add a key for search so we toggle
      //

    //
    renderShoppingList();


  });
}
// write in functionality for if hideChecked is true


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
  handleFilterClick();
  handleSearchBar();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);
