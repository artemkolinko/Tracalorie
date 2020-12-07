// =================================
// Storage Controller
// =================================
const StorageCtrl = (function () {
  // public methods
  return {
    setItemToStorage: function (item) {
      // Get array of items from local storage
      const lsItemsArr = JSON.parse(localStorage.getItem('items'));

      // Check if any items in ls
      if (lsItemsArr) {
        // Add second+ item
        lsItemsArr.push(item);
        // Convert to string and re set to ls
        localStorage.setItem('items', JSON.stringify(lsItemsArr));
      } else {
        // Add first item
        const itemsArr = [];
        itemsArr.push(item);
        // Convert to string and set to ls
        localStorage.setItem('items', JSON.stringify(itemsArr));
      }
    },
    getItemsFromStorage: function () {
      return localStorage.getItem('items')
        ? JSON.parse(localStorage.getItem('items'))
        : [];
    },
    updateItemStorage: function (updatedItem) {
      const items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function (item, index) {
        if (item.id === updatedItem.id) {
          items.splice(index, 1, updatedItem);
        }
      });

      // Convert to string and re set to ls
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemStorage: function (id) {
      const items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function (item, index) {
        if (item.id === id) {
          items.splice(index, 1);
        }
      });

      // Convert to string and re set to ls
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteAllItemsFromStorage: function () {
      localStorage.removeItem('items');
      // localStorage.clear();
    },
  };
})();

// =================================
// Item Controller
// =================================
const ItemCtrl = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name.trim();
    this.calories = calories;
  };

  // Data Structure / State
  const state = {
    // items: [
    //   { id: 1, name: 'Steak Dinner', calories: 1200 },
    //   { id: 2, name: 'Cookie', calories: 500 },
    //   { id: 3, name: 'Eggs', calories: 200 },
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0,
  };

  // Export methods to public
  return {
    addItem: function (name, calories) {
      // Create id
      const id = state.items.length
        ? state.items[state.items.length - 1].id + 1
        : 0;

      // Convert calories to number
      calories = parseInt(calories);

      // Create a new item
      const newItem = new Item(id, name, calories);

      // Add to state
      state.items.push(newItem);

      return newItem;
    },
    getItems: function () {
      return state.items;
    },
    clearAll: function () {
      state.items = [];
      state.currentItem = null;
      state.totalCalories = 0;
    },
    updateItem: function ({ name, calories }) {
      calories = parseInt(calories);
      let found = null;

      state.items.forEach(function (item) {
        if (item.id === state.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },
    getItemById: function (id) {
      return state.items.find((item) => item.id === id);
      // let found = null;
      // state.items.forEach(function (item) {
      //   if (item.id === id) {
      //     found = item;
      //   }
      // });
      // return found;
    },
    deleteItemById: function (id) {
      // Get ids
      const ids = state.items.map(function (item) {
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Delete 1 items from state
      state.items.splice(index, 1);
    },
    getTotalCalories: function () {
      let totalCalories = 0;

      state.items.forEach(function (item) {
        totalCalories += item.calories;
      });

      state.totalCalories = totalCalories;

      return state.totalCalories;
    },
    setCurrentItem: function (item) {
      state.currentItem = item;
    },
    getCurrentItem: function () {
      return state.currentItem;
    },
    logState: function () {
      return state;
    },
  };
})();

// =================================
// UI Controller
// =================================
const UICtrl = (function () {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '#add-btn',
    updateBtn: '#edit-btn',
    deleteBtn: '#delete-btn',
    clearAll: '#clear-all-btn',
    backBtn: '#back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '#total-calories',
  };

  createLi = function ({ id, name, calories }) {
    return `
    <li class="collection-item" id="item-${id}">
      <strong>${name}:</strong> <em>${calories} Calories</em>
      <a href="#" class="secondary-content blue-text">
        <i class="material-icons edit-item">edit</i>
      </a>
    </li>`;

    // or create li element like that (what is the best?)
    // const newLi = document.createElement('li');
    // newLi.className = 'collection-item';
    // newLi.id = 'item-' + item.id;
    // newLi.innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calories</em>
    // <a href="#" class="secondary-content blue-text">
    //   <i class="material-icons">edit</i>
    // </a>`;
  };

  // Public methods
  return {
    populateItemList: function (items) {
      let html = '';

      items.forEach(function (item) {
        html += createLi(item);
      });
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },
    getSelectors: function () {
      return UISelectors;
    },
    addListItem: function (item) {
      // Show item list
      document.querySelector(UISelectors.itemList).style.display = 'block';

      const li = createLi(item);

      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentHTML('beforeend', li);
    },
    updateListItem: function ({ id, name, calories }) {
      // Get list of items
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Convert node list to array
      listItems = Array.from(listItems);

      listItems.forEach(function (li) {
        // Get id of list item
        const itemId = li.getAttribute('id');

        if (itemId === `item-${id}`) {
          document.querySelector(`#${itemId}`).innerHTML = `
          <strong>${name}:</strong>
          <em>${calories} Calories</em>
          <a href="#" class="secondary-content blue-text">
            <i class="material-icons edit-item">edit</i>
          </a>`;
        }
      });
    },
    deleteItemFromUI: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearAll: function () {
      // Get list of items
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Convert node list to array
      listItems = Array.from(listItems);

      // Remove all items
      listItems.forEach(function (item) {
        item.remove();
      });

      // OR?
      // document.querySelector(UISelectors.itemList).innerHTML = '';
    },
    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function () {
      document.querySelector(
        UISelectors.itemNameInput
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        UISelectors.itemCaloriesInput
      ).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
      // UnDisabled add button
      document.querySelector(UISelectors.addBtn).disabled = false;
    },
    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
      // Disabled add button
      document.querySelector(UISelectors.addBtn).disabled = true;
    },
  };
})();

// =================================
// App Controller
// =================================
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
  // Load Event Listeners
  const loadEventListeners = function () {
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener('click', itemAddSubmit);

    // Alternative to Disabled / Enabled add button in UICtrl.showEditState()
    // Disabled submit on Enter press or use addBtn.disabled = true || false in showEditState and clearEditState
    // e.keyCode and e.which are deprecated - (e.keyCode === 13 || e.which === 13) so use (e.code === 'Enter')
    // document.addEventListener('keypress', function (e) {
    //   if (e.code === 'Enter') {
    //     e.preventDefault();
    //     return false;
    //   }
    // });

    // Edit icon click event
    // Using event delegation, because edit icon may not exist
    document
      .querySelector(UISelectors.itemList)
      .addEventListener('click', itemEditClick);

    // Update item click event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener('click', itemUpdateSubmit);

    // Delete item click event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener('click', itemDeleteSubmit);

    // Back btn click event - exit from edit mode
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener('click', function (e) {
        UICtrl.clearEditState();
        e.preventDefault();
      });

    // Clear All item button event
    document
      .querySelector(UISelectors.clearAll)
      .addEventListener('click', clearAllClick);
  };

  // Click add item button handler
  const itemAddSubmit = function (e) {
    // Get form input from UI controller
    const input = UICtrl.getItemInput();

    // Check for name and calories
    if (input.name && input.calories) {
      // Add item to state
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add item to local store
      StorageCtrl.setItemToStorage(newItem);
      // Add item to UI
      UICtrl.addListItem(newItem);

      // Get total calories from state
      const totalCalories = ItemCtrl.getTotalCalories();
      // Show total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Clear input
      UICtrl.clearInput();
    }

    e.preventDefault();
  };

  // click edit item icon handler
  const itemEditClick = function (e) {
    // event delegation, because it's enitial loaded (after the page loaded)
    if (e.target.classList.contains('edit-item')) {
      // Get list item id
      const listId = e.target.parentNode.parentNode.id;
      const listIdArr = listId.split('-');
      const id = parseInt(listIdArr[1]);

      // Get item from state
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current item to state
      ItemCtrl.setCurrentItem(itemToEdit);

      // Paste current item in input form
      UICtrl.addItemToForm();

      // Scroll page to top
      window.scrollTo(0, 0);
    }

    e.preventDefault();
  };

  // click update item (meal) button handler
  const itemUpdateSubmit = function (e) {
    // Get item input value from form
    const input = UICtrl.getItemInput();

    // Update state and return updated item
    const updatedItem = ItemCtrl.updateItem(input);

    // Update UI list item
    UICtrl.updateListItem(updatedItem);

    // Get total calories from state
    const totalCalories = ItemCtrl.getTotalCalories();
    // Show total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Update item in Storage
    StorageCtrl.updateItemStorage(updatedItem);

    // Clear Edit state
    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Click delete item button handler
  const itemDeleteSubmit = function (e) {
    // Get current item
    const { id } = ItemCtrl.getCurrentItem();

    // Delete item from state
    ItemCtrl.deleteItemById(id);

    // Delete item from Storage
    StorageCtrl.deleteItemStorage(id);

    // Delete from UI
    UICtrl.deleteItemFromUI(id);

    // Update total calories
    UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());

    // Clear edit state
    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Click clear all button handler
  const clearAllClick = function (e) {
    // Clear state
    ItemCtrl.clearAll();

    // Clear Local Storage
    StorageCtrl.deleteAllItemsFromStorage();

    // Update total calories
    UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());

    // Clear UI
    UICtrl.clearAll();
    UICtrl.hideList();

    e.preventDefault();
  };

  // Public methods
  return {
    init: function () {
      // Set initial state / Clear edit state
      UICtrl.clearEditState();

      // Fetch items from data stucture
      const items = ItemCtrl.getItems();

      if (items.length) {
        // Populate List with items
        UICtrl.populateItemList(items);
      } else {
        // Hide item list
        UICtrl.hideList();
      }

      // Get total calories from state
      const totalCalories = ItemCtrl.getTotalCalories();
      // Show total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Add event listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();
