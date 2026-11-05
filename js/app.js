// Premium TodoList Life Dashboard
// Main application file

// ============================================================================
// EventBus Module
// ============================================================================
// Purpose: Provides decoupled communication between components using 
// publish-subscribe pattern

const EventBus = (function() {
  // Private events storage - closure provides encapsulation
  const events = {};

  /**
   * Subscribe to an event
   * @param {string} eventName - Name of the event to subscribe to
   * @param {function} callback - Function to call when event is published
   */
  function subscribe(eventName, callback) {
    // Validate inputs
    if (typeof eventName !== 'string' || !eventName) {
      console.error('EventBus.subscribe: eventName must be a non-empty string');
      return;
    }
    if (typeof callback !== 'function') {
      console.error('EventBus.subscribe: callback must be a function');
      return;
    }

    // Initialize event array if it doesn't exist
    if (!events[eventName]) {
      events[eventName] = [];
    }

    // Add callback to the event's subscriber list
    events[eventName].push(callback);
  }

  /**
   * Unsubscribe from an event
   * @param {string} eventName - Name of the event to unsubscribe from
   * @param {function} callback - Function to remove from subscribers
   */
  function unsubscribe(eventName, callback) {
    // Validate inputs
    if (typeof eventName !== 'string' || !eventName) {
      console.error('EventBus.unsubscribe: eventName must be a non-empty string');
      return;
    }
    if (typeof callback !== 'function') {
      console.error('EventBus.unsubscribe: callback must be a function');
      return;
    }

    // Check if event exists
    if (!events[eventName]) {
      return;
    }

    // Remove the callback from the event's subscriber list
    events[eventName] = events[eventName].filter(cb => cb !== callback);

    // Clean up empty event arrays
    if (events[eventName].length === 0) {
      delete events[eventName];
    }
  }

  /**
   * Publish an event to all subscribers
   * @param {string} eventName - Name of the event to publish
   * @param {*} data - Data to pass to subscribers
   */
  function publish(eventName, data) {
    // Validate event name
    if (typeof eventName !== 'string' || !eventName) {
      console.error('EventBus.publish: eventName must be a non-empty string');
      return;
    }

    // Check if event has subscribers
    if (!events[eventName] || events[eventName].length === 0) {
      return;
    }

    // Notify all subscribers
    events[eventName].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`EventBus: Error in ${eventName} handler:`, error);
      }
    });
  }

  // Public API
  return {
    subscribe,
    unsubscribe,
    publish
  };
})();

// ============================================================================
// DOMController Module
// ============================================================================
// Purpose: Centralizes DOM manipulation and element creation with error handling

const DOMController = (function() {
  'use strict';

  /**
   * Creates a new DOM element with optional class and text content
   * @param {string} tag - HTML tag name (e.g., 'div', 'span', 'button')
   * @param {string} className - CSS class name(s) to add (optional)
   * @param {string} textContent - Text content for the element (optional)
   * @returns {HTMLElement|null} The created element, or null on error
   */
  function createElement(tag, className, textContent) {
    try {
      if (!tag || typeof tag !== 'string') {
        console.error('DOMController.createElement: Invalid tag parameter');
        return null;
      }

      const element = document.createElement(tag);
      
      if (className) {
        element.className = className;
      }
      
      if (textContent !== undefined && textContent !== null) {
        element.textContent = textContent;
      }
      
      return element;
    } catch (error) {
      console.error('DOMController.createElement error:', error);
      return null;
    }
  }

  /**
   * Queries and returns a single element matching the selector
   * @param {string} selector - CSS selector
   * @returns {HTMLElement|null} The matched element, or null if not found
   */
  function getElement(selector) {
    try {
      if (!selector || typeof selector !== 'string') {
        console.error('DOMController.getElement: Invalid selector parameter');
        return null;
      }
      
      return document.querySelector(selector);
    } catch (error) {
      console.error('DOMController.getElement error:', error);
      return null;
    }
  }

  /**
   * Queries and returns all elements matching the selector
   * @param {string} selector - CSS selector
   * @returns {NodeList|Array} NodeList of matched elements, or empty array on error
   */
  function getElements(selector) {
    try {
      if (!selector || typeof selector !== 'string') {
        console.error('DOMController.getElements: Invalid selector parameter');
        return [];
      }
      
      return document.querySelectorAll(selector);
    } catch (error) {
      console.error('DOMController.getElements error:', error);
      return [];
    }
  }

  /**
   * Sets the text content of an element safely
   * @param {HTMLElement} element - The element to update
   * @param {string} text - The text content to set
   * @returns {boolean} True if successful, false otherwise
   */
  function setText(element, text) {
    try {
      if (!element || !(element instanceof HTMLElement)) {
        console.error('DOMController.setText: Invalid element parameter');
        return false;
      }
      
      element.textContent = text !== undefined && text !== null ? text : '';
      return true;
    } catch (error) {
      console.error('DOMController.setText error:', error);
      return false;
    }
  }

  /**
   * Adds a CSS class to an element
   * @param {HTMLElement} element - The element to modify
   * @param {string} className - The class name to add
   * @returns {boolean} True if successful, false otherwise
   */
  function addClass(element, className) {
    try {
      if (!element || !(element instanceof HTMLElement)) {
        console.error('DOMController.addClass: Invalid element parameter');
        return false;
      }
      
      if (!className || typeof className !== 'string') {
        console.error('DOMController.addClass: Invalid className parameter');
        return false;
      }
      
      element.classList.add(className);
      return true;
    } catch (error) {
      console.error('DOMController.addClass error:', error);
      return false;
    }
  }

  /**
   * Removes a CSS class from an element
   * @param {HTMLElement} element - The element to modify
   * @param {string} className - The class name to remove
   * @returns {boolean} True if successful, false otherwise
   */
  function removeClass(element, className) {
    try {
      if (!element || !(element instanceof HTMLElement)) {
        console.error('DOMController.removeClass: Invalid element parameter');
        return false;
      }
      
      if (!className || typeof className !== 'string') {
        console.error('DOMController.removeClass: Invalid className parameter');
        return false;
      }
      
      element.classList.remove(className);
      return true;
    } catch (error) {
      console.error('DOMController.removeClass error:', error);
      return false;
    }
  }

  /**
   * Toggles a CSS class on an element
   * @param {HTMLElement} element - The element to modify
   * @param {string} className - The class name to toggle
   * @returns {boolean} True if class was added, false if removed or on error
   */
  function toggleClass(element, className) {
    try {
      if (!element || !(element instanceof HTMLElement)) {
        console.error('DOMController.toggleClass: Invalid element parameter');
        return false;
      }
      
      if (!className || typeof className !== 'string') {
        console.error('DOMController.toggleClass: Invalid className parameter');
        return false;
      }
      
      return element.classList.toggle(className);
    } catch (error) {
      console.error('DOMController.toggleClass error:', error);
      return false;
    }
  }

  /**
   * Attaches an event listener to an element
   * @param {HTMLElement} element - The element to attach the listener to
   * @param {string} event - The event type (e.g., 'click', 'input')
   * @param {Function} handler - The event handler function
   * @returns {boolean} True if successful, false otherwise
   */
  function addEventListener(element, event, handler) {
    try {
      if (!element || !(element instanceof HTMLElement)) {
        console.error('DOMController.addEventListener: Invalid element parameter');
        return false;
      }
      
      if (!event || typeof event !== 'string') {
        console.error('DOMController.addEventListener: Invalid event parameter');
        return false;
      }
      
      if (typeof handler !== 'function') {
        console.error('DOMController.addEventListener: Invalid handler parameter');
        return false;
      }
      
      element.addEventListener(event, handler);
      return true;
    } catch (error) {
      console.error('DOMController.addEventListener error:', error);
      return false;
    }
  }

  /**
   * Removes all child nodes from an element
   * @param {HTMLElement} element - The element to clear
   * @returns {boolean} True if successful, false otherwise
   */
  function clearChildren(element) {
    try {
      if (!element || !(element instanceof HTMLElement)) {
        console.error('DOMController.clearChildren: Invalid element parameter');
        return false;
      }
      
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      
      return true;
    } catch (error) {
      console.error('DOMController.clearChildren error:', error);
      return false;
    }
  }

  // Public API
  return {
    createElement,
    getElement,
    getElements,
    setText,
    addClass,
    removeClass,
    toggleClass,
    addEventListener,
    clearChildren
  };
})();

// ============================================================================
// StorageManager Module
// ============================================================================
// Purpose: Abstracts Local Storage operations and provides data persistence layer

const StorageManager = (function() {
  'use strict';

  // Storage keys
  const TASKS_KEY = 'todolist_tasks';
  const LINKS_KEY = 'todolist_links';

  // In-memory storage fallback
  let inMemoryStorage = {
    tasks: [],
    links: []
  };

  // Track storage availability
  let storageAvailable = null;

  /**
   * Checks if Local Storage is available
   * @returns {boolean} True if Local Storage is available, false otherwise
   */
  function isAvailable() {
    // Return cached result if already checked
    if (storageAvailable !== null) {
      return storageAvailable;
    }

    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      storageAvailable = true;
      return true;
    } catch (error) {
      storageAvailable = false;
      console.warn('StorageManager: Local Storage is not available. Fallback to in-memory storage.', error);
      
      // Publish storage:error event for unavailability
      EventBus.publish('storage:error', {
        type: 'unavailable',
        message: 'Local storage is disabled. Data will not be saved between sessions.',
        error: error
      });
      
      return false;
    }
  }

  /**
   * Validates if an object is a valid task
   * @param {*} task - The object to validate
   * @returns {boolean} True if valid task, false otherwise
   */
  function isValidTask(task) {
    return task &&
           typeof task === 'object' &&
           typeof task.id === 'string' &&
           task.id.length > 0 &&
           typeof task.description === 'string' &&
           task.description.trim().length > 0 &&
           typeof task.completed === 'boolean' &&
           typeof task.timestamp === 'number' &&
           task.timestamp > 0;
  }

  /**
   * Validates if an object is a valid link
   * @param {*} link - The object to validate
   * @returns {boolean} True if valid link, false otherwise
   */
  function isValidLink(link) {
    return link &&
           typeof link === 'object' &&
           typeof link.id === 'string' &&
           link.id.length > 0 &&
           typeof link.url === 'string' &&
           link.url.length > 0 &&
           typeof link.label === 'string' &&
           link.label.trim().length > 0;
  }

  /**
   * Retrieves and parses tasks from Local Storage or in-memory fallback
   * @returns {Array} Array of task objects, or empty array if none found or on error
   */
  function getTasks() {
    try {
      // Use in-memory storage if Local Storage is unavailable
      if (!isAvailable()) {
        console.warn('StorageManager.getTasks: Using in-memory storage fallback');
        return [...inMemoryStorage.tasks]; // Return copy to prevent direct mutation
      }

      const tasksJson = localStorage.getItem(TASKS_KEY);
      
      // Return empty array if no tasks stored
      if (!tasksJson) {
        return [];
      }

      // Parse JSON
      const tasks = JSON.parse(tasksJson);

      // Validate that result is an array
      if (!Array.isArray(tasks)) {
        const errorMsg = 'StorageManager.getTasks: Stored data is not an array';
        console.error(errorMsg, { receivedType: typeof tasks, value: tasks });
        
        // Publish corruption error
        EventBus.publish('storage:error', {
          type: 'corrupted_data',
          message: 'Some task data could not be loaded.',
          details: errorMsg
        });
        
        return [];
      }

      // Filter out invalid tasks and return only valid ones
      const validTasks = tasks.filter(task => {
        const valid = isValidTask(task);
        if (!valid) {
          console.warn('StorageManager.getTasks: Skipping invalid task', { task });
          
          // Publish corruption warning for invalid task
          EventBus.publish('storage:error', {
            type: 'corrupted_data',
            message: 'Some task data was corrupted and skipped.',
            details: 'Invalid task structure detected'
          });
        }
        return valid;
      });

      return validTasks;
    } catch (error) {
      const errorMsg = 'StorageManager.getTasks: Error reading tasks';
      console.error(errorMsg, { error: error.message, stack: error.stack });
      
      // Publish error event
      EventBus.publish('storage:error', {
        type: 'read_error',
        message: 'Failed to load tasks. Please refresh the page.',
        error: error
      });
      
      return [];
    }
  }

  /**
   * Serializes and stores tasks to Local Storage or in-memory fallback
   * @param {Array} tasks - Array of task objects to store
   * @returns {boolean} True if successful, false otherwise
   */
  function saveTasks(tasks) {
    try {
      // Validate input is an array
      if (!Array.isArray(tasks)) {
        const errorMsg = 'StorageManager.saveTasks: tasks parameter must be an array';
        console.error(errorMsg, { receivedType: typeof tasks, value: tasks });
        return false;
      }

      // Use in-memory storage if Local Storage is unavailable
      if (!isAvailable()) {
        console.warn('StorageManager.saveTasks: Using in-memory storage fallback');
        inMemoryStorage.tasks = [...tasks]; // Store copy to prevent external mutation
        return true; // Return success for in-memory storage
      }

      // Serialize to JSON
      const tasksJson = JSON.stringify(tasks);
      
      // Store in Local Storage
      localStorage.setItem(TASKS_KEY, tasksJson);
      
      return true;
    } catch (error) {
      // Check for quota exceeded error
      if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        const errorMsg = 'StorageManager.saveTasks: Storage quota exceeded';
        console.error(errorMsg, { 
          error: error.message, 
          stack: error.stack,
          attemptedSize: tasks.length + ' tasks'
        });
        
        EventBus.publish('storage:error', {
          type: 'quota_exceeded',
          message: 'Storage limit reached. Please delete some tasks or links.',
          error: error
        });
      } else {
        const errorMsg = 'StorageManager.saveTasks: Error saving tasks';
        console.error(errorMsg, { 
          error: error.message, 
          stack: error.stack 
        });
        
        EventBus.publish('storage:error', {
          type: 'save_error',
          message: 'Failed to save tasks. Please try again.',
          error: error
        });
      }
      return false;
    }
  }

  /**
   * Retrieves and parses links from Local Storage or in-memory fallback
   * @returns {Array} Array of link objects, or empty array if none found or on error
   */
  function getLinks() {
    try {
      // Use in-memory storage if Local Storage is unavailable
      if (!isAvailable()) {
        console.warn('StorageManager.getLinks: Using in-memory storage fallback');
        return [...inMemoryStorage.links]; // Return copy to prevent direct mutation
      }

      const linksJson = localStorage.getItem(LINKS_KEY);
      
      // Return empty array if no links stored
      if (!linksJson) {
        return [];
      }

      // Parse JSON
      const links = JSON.parse(linksJson);

      // Validate that result is an array
      if (!Array.isArray(links)) {
        const errorMsg = 'StorageManager.getLinks: Stored data is not an array';
        console.error(errorMsg, { receivedType: typeof links, value: links });
        
        // Publish corruption error
        EventBus.publish('storage:error', {
          type: 'corrupted_data',
          message: 'Some link data could not be loaded.',
          details: errorMsg
        });
        
        return [];
      }

      // Filter out invalid links and return only valid ones
      const validLinks = links.filter(link => {
        const valid = isValidLink(link);
        if (!valid) {
          console.warn('StorageManager.getLinks: Skipping invalid link', { link });
          
          // Publish corruption warning for invalid link
          EventBus.publish('storage:error', {
            type: 'corrupted_data',
            message: 'Some link data was corrupted and skipped.',
            details: 'Invalid link structure detected'
          });
        }
        return valid;
      });

      return validLinks;
    } catch (error) {
      const errorMsg = 'StorageManager.getLinks: Error reading links';
      console.error(errorMsg, { error: error.message, stack: error.stack });
      
      // Publish error event
      EventBus.publish('storage:error', {
        type: 'read_error',
        message: 'Failed to load links. Please refresh the page.',
        error: error
      });
      
      return [];
    }
  }

  /**
   * Serializes and stores links to Local Storage or in-memory fallback
   * @param {Array} links - Array of link objects to store
   * @returns {boolean} True if successful, false otherwise
   */
  function saveLinks(links) {
    try {
      // Validate input is an array
      if (!Array.isArray(links)) {
        const errorMsg = 'StorageManager.saveLinks: links parameter must be an array';
        console.error(errorMsg, { receivedType: typeof links, value: links });
        return false;
      }

      // Use in-memory storage if Local Storage is unavailable
      if (!isAvailable()) {
        console.warn('StorageManager.saveLinks: Using in-memory storage fallback');
        inMemoryStorage.links = [...links]; // Store copy to prevent external mutation
        return true; // Return success for in-memory storage
      }

      // Serialize to JSON
      const linksJson = JSON.stringify(links);
      
      // Store in Local Storage
      localStorage.setItem(LINKS_KEY, linksJson);
      
      return true;
    } catch (error) {
      // Check for quota exceeded error
      if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        const errorMsg = 'StorageManager.saveLinks: Storage quota exceeded';
        console.error(errorMsg, { 
          error: error.message, 
          stack: error.stack,
          attemptedSize: links.length + ' links'
        });
        
        EventBus.publish('storage:error', {
          type: 'quota_exceeded',
          message: 'Storage limit reached. Please delete some tasks or links.',
          error: error
        });
      } else {
        const errorMsg = 'StorageManager.saveLinks: Error saving links';
        console.error(errorMsg, { 
          error: error.message, 
          stack: error.stack 
        });
        
        EventBus.publish('storage:error', {
          type: 'save_error',
          message: 'Failed to save links. Please try again.',
          error: error
        });
      }
      return false;
    }
  }

  // Public API
  return {
    isAvailable,
    getTasks,
    saveTasks,
    getLinks,
    saveLinks
  };
})();

// Application initialization will be implemented here

// ============================================================================
// GreetingComponent Module
// ============================================================================
// Purpose: Displays time-aware greeting with current date and time

const GreetingComponent = (function() {
  'use strict';

  let state = {
    currentDate: new Date(),
    updateInterval: null
  };

  /**
   * Formats date as "Monday, November 5, 2024"
   * @returns {string} Formatted date string
   */
  function formatDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return state.currentDate.toLocaleDateString('en-US', options);
  }

  /**
   * Formats time as "2:30 PM"
   * @returns {string} Formatted time string
   */
  function formatTime() {
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    return state.currentDate.toLocaleTimeString('en-US', options);
  }

  /**
   * Gets greeting message based on time of day
   * @returns {string} Appropriate greeting
   */
  function getGreetingMessage() {
    const hour = state.currentDate.getHours();
    
    if (hour >= 6 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 18) {
      return 'Good Afternoon';
    } else if (hour >= 18 && hour < 24) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  }

  /**
   * Renders greeting display with date, time, and message
   * @returns {object} Display data
   */
  function render() {
    state.currentDate = new Date();
    
    return {
      greeting: getGreetingMessage(),
      date: formatDate(),
      time: formatTime()
    };
  }

  /**
   * Starts the update cycle - updates every 60 seconds
   */
  function start() {
    if (state.updateInterval) {
      return; // Already running
    }
    
    state.updateInterval = setInterval(() => {
      const displayed = render();
      EventBus.publish('greeting:updated', displayed);
    }, 60000); // Update every minute
    
    // Render immediately on start
    const displayed = render();
    EventBus.publish('greeting:updated', displayed);
  }

  /**
   * Stops the update cycle
   */
  function stop() {
    if (state.updateInterval) {
      clearInterval(state.updateInterval);
      state.updateInterval = null;
    }
  }

  // Public API
  return {
    render,
    start,
    stop,
    formatDate,
    formatTime,
    getGreetingMessage
  };
})();

// ============================================================================
// TimerComponent Module
// ============================================================================
// Purpose: Implements Pomodoro focus timer with 25-minute default

const TimerComponent = (function() {
  'use strict';

  let state = {
    timeRemaining: 1500, // 25 minutes in seconds
    isRunning: false,
    isPaused: false,
    intervalId: null
  };

  /**
   * Gets current timer state
   * @returns {object} Current state
   */
  function getState() {
    return {
      timeRemaining: state.timeRemaining,
      isRunning: state.isRunning,
      isPaused: state.isPaused
    };
  }

  /**
   * Formats time as MM:SS
   * @returns {string} Formatted time
   */
  function formatTime() {
    const minutes = Math.floor(state.timeRemaining / 60);
    const seconds = Math.floor(state.timeRemaining % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  /**
   * Renders timer display
   * @returns {string} Formatted timer
   */
  function render() {
    return formatTime();
  }

  /**
   * Starts the timer countdown
   */
  function start() {
    if (state.isRunning) {
      return; // Already running
    }
    state.isRunning = true;
    state.isPaused = false;

    state.intervalId = setInterval(() => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1;
        EventBus.publish('timer:tick', { timeRemaining: state.timeRemaining, display: render() });
      } else {
        // Timer finished
        state.isRunning = false;
        state.timeRemaining = 0;
        clearInterval(state.intervalId);
        state.intervalId = null;
        EventBus.publish('timer:finished', { display: render() });
        // Auto-reset to 25 minutes
        state.timeRemaining = 1500;
      }
    }, 1000);
  }

  /**
   * Pauses the timer
   */
  function pause() {
    if (!state.isRunning || state.isPaused) {
      return;
    }
    state.isPaused = true;
    state.isRunning = false;
    if (state.intervalId) {
      clearInterval(state.intervalId);
      state.intervalId = null;
    }
  }

  /**
   * Resumes from paused state
   */
  function resume() {
    if (!state.isPaused) {
      return;
    }
    
    state.isPaused = false;
    start();
  }

  /**
   * Resets timer to 25 minutes
   */
  function reset() {
    if (state.intervalId) {
      clearInterval(state.intervalId);
      state.intervalId = null;
    }
    
    state.timeRemaining = 1500;
    state.isRunning = false;
    state.isPaused = false;
    EventBus.publish('timer:reset', { display: render() });
  }

  // Public API
  return {
    render,
    start,
    pause,
    resume,
    reset,
    getState,
    formatTime
  };
})();

// ============================================================================
// TodoListComponent Module
// ============================================================================
// Purpose: Manages todo list with CRUD operations and storage integration

const TodoListComponent = (function() {
  'use strict';

  let state = {
    tasks: [],
    nextId: 1
  };

  /**
   * Initialize component with stored tasks
   */
  function initialize() {
    state.tasks = StorageManager.getTasks();
    if (state.tasks && state.tasks.length > 0) {
      // Find highest ID to continue from
      const ids = state.tasks.map(t => parseInt(t.id));
      state.nextId = Math.max(...ids) + 1;
    }
  }

  /**
   * Gets all tasks
   * @returns {Array} Array of task objects
   */
  function getTasks() {
    return [...state.tasks];
  }

  /**
   * Adds a new task
   * @param {string} description - Task description
   * @returns {object} Created task
   */
  function addTask(description) {
    if (!description || !description.trim()) {
      console.error('TodoListComponent.addTask: Invalid description');
      return null;
    }

    const task = {
      id: String(state.nextId++),
      description: description.trim(),
      completed: false,
      timestamp: Date.now()
    };

    state.tasks.push(task);
    StorageManager.saveTasks(state.tasks);
    EventBus.publish('task:created', task);
    return task;
  }

  /**
   * Edits an existing task
   * @param {string} taskId - Task ID
   * @param {string} description - New description
   * @returns {boolean} Success
   */
  function editTask(taskId, description) {
    if (!description || !description.trim()) {
      console.error('TodoListComponent.editTask: Invalid description');
      return false;
    }

    const task = state.tasks.find(t => t.id === taskId);
    if (!task) {
      console.error('TodoListComponent.editTask: Task not found', { taskId });
      return false;
    }

    task.description = description.trim();
    StorageManager.saveTasks(state.tasks);
    EventBus.publish('task:updated', task);
    return true;
  }

  /**
   * Toggles task completion status
   * @param {string} taskId - Task ID
   * @returns {boolean} New completed state
   */
  function toggleTask(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) {
      console.error('TodoListComponent.toggleTask: Task not found', { taskId });
      return false;
    }

    task.completed = !task.completed;
    StorageManager.saveTasks(state.tasks);
    EventBus.publish('task:toggled', task);
    return task.completed;
  }

  /**
   * Deletes a task
   * @param {string} taskId - Task ID
   * @returns {boolean} Success
   */
  function deleteTask(taskId) {
    const index = state.tasks.findIndex(t => t.id === taskId);
    if (index === -1) {
      console.error('TodoListComponent.deleteTask: Task not found', { taskId });
      return false;
    }

    const deleted = state.tasks.splice(index, 1)[0];
    StorageManager.saveTasks(state.tasks);
    EventBus.publish('task:deleted', deleted);
    return true;
  }

  /**
   * Renders task list HTML
   * @returns {string} HTML for task list
   */
  function render() {
    if (!state.tasks || state.tasks.length === 0) {
      return '<li class="empty-message">No tasks yet. Add one to get started!</li>';
    }

    return state.tasks.map(task => `
      <li class="task-item ${task.completed ? 'task-completed' : ''}">
        <input type="checkbox" class="task-checkbox" data-task-id="${task.id}" ${task.completed ? 'checked' : ''}>
        <span class="task-description">${task.description}</span>
        <button class="task-delete" data-task-id="${task.id}">Delete</button>
      </li>
    `).join('');
  }

  initialize();

  // Public API
  return {
    getTasks,
    addTask,
    editTask,
    toggleTask,
    deleteTask,
    render
  };
})();

// ============================================================================
// QuickLinksComponent Module
// ============================================================================
// Purpose: Manages quick access links with CRUD operations

const QuickLinksComponent = (function() {
  'use strict';

  let state = {
    links: [],
    nextId: 1
  };

  /**
   * Initialize component with stored links
   */
  function initialize() {
    state.links = StorageManager.getLinks();
    if (state.links && state.links.length > 0) {
      const ids = state.links.map(l => parseInt(l.id));
      state.nextId = Math.max(...ids) + 1;
    }
  }

  /**
   * Gets all links
   * @returns {Array} Array of link objects
   */
  function getLinks() {
    return [...state.links];
  }

  /**
   * Adds a new link
   * @param {string} url - Link URL
   * @param {string} label - Link label
   * @returns {object} Created link
   */
  function addLink(url, label) {
    if (!url || !url.trim() || !label || !label.trim()) {
      console.error('QuickLinksComponent.addLink: Invalid URL or label');
      return null;
    }

    const link = {
      id: String(state.nextId++),
      url: url.trim(),
      label: label.trim()
    };

    state.links.push(link);
    StorageManager.saveLinks(state.links);
    EventBus.publish('link:created', link);
    return link;
  }

  /**
   * Edits an existing link
   * @param {string} linkId - Link ID
   * @param {string} url - New URL
   * @param {string} label - New label
   * @returns {boolean} Success
   */
  function editLink(linkId, url, label) {
    if (!url || !url.trim() || !label || !label.trim()) {
      console.error('QuickLinksComponent.editLink: Invalid URL or label');
      return false;
    }

    const link = state.links.find(l => l.id === linkId);
    if (!link) {
      console.error('QuickLinksComponent.editLink: Link not found', { linkId });
      return false;
    }

    link.url = url.trim();
    link.label = label.trim();
    StorageManager.saveLinks(state.links);
    EventBus.publish('link:updated', link);
    return true;
  }

  /**
   * Deletes a link
   * @param {string} linkId - Link ID
   * @returns {boolean} Success
   */
  function deleteLink(linkId) {
    const index = state.links.findIndex(l => l.id === linkId);
    if (index === -1) {
      console.error('QuickLinksComponent.deleteLink: Link not found', { linkId });
      return false;
    }

    const deleted = state.links.splice(index, 1)[0];
    StorageManager.saveLinks(state.links);
    EventBus.publish('link:deleted', deleted);
    return true;
  }

  /**
   * Renders links as grid
   * @returns {string} HTML for links grid
   */
  function render() {
    if (!state.links || state.links.length === 0) {
      return '<div class="empty-message">No quick links yet. Add one!</div>';
    }

    return state.links.map(link => `
      <div class="link-item" data-link-id="${link.id}">
        <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="link-box">
          <span class="link-label">${link.label}</span>
        </a>
        <button class="link-delete" data-link-id="${link.id}">�</button>
      </div>
    `).join('');
  }

  initialize();

  // Public API
  return {
    getLinks,
    addLink,
    editLink,
    deleteLink,
    render
  };
})();

// ============================================================================
// App Module
// ============================================================================
// Purpose: Main application initialization and orchestration

const App = (function() {
  'use strict';

  let state = {
    initialized: false
  };

  /**
   * Shows a notification message
   * @param {string} message - Message to display
   * @param {string} type - Message type (success, error, info, warning)
   * @param {number} duration - Duration in ms (default 3000)
   */
  function showNotification(message, type = 'info', duration = 3000) {
    const notificationEl = DOMController.getElement('#notification-area');
    if (!notificationEl) {
      console.warn('App.showNotification: Notification area not found');
      return;
    }

    // Clear previous notifications
    DOMController.clearChildren(notificationEl);

    // Create notification
    const notification = DOMController.createElement('div', `notification notification-${type}`, message);
    notificationEl.appendChild(notification);

    // Auto-hide after duration
    setTimeout(() => {
      if (notificationEl.contains(notification)) {
        notificationEl.removeChild(notification);
      }
    }, duration);
  }

  /**
   * Initialize application
   */
  function initialize() {
    if (state.initialized) {
      return;
    }

    try {
      // Subscribe to storage errors
      EventBus.subscribe('storage:error', (error) => {
        console.error('Storage error:', error);
        showNotification(error.message, 'error', 5000);
      });

      // Initialize components
      GreetingComponent.start();
      
      // Render initial component states
      updateDisplay();

      // Wire up event handlers
      setupEventHandlers();

      state.initialized = true;
      console.log('App initialized successfully');
    } catch (error) {
      console.error('App initialization failed:', error);
      showNotification('Failed to initialize application', 'error');
    }
  }

  /**
   * Updates all component displays
   */
  function updateDisplay() {
    updateGreetingDisplay();
    updateTimerDisplay();
    updateTodoDisplay();
    updateLinksDisplay();
  }

  /**
   * Updates greeting component display
   */
  function updateGreetingDisplay() {
    try {
      const greetingEl = DOMController.getElement('#greeting-display');
      if (!greetingEl) return;

      const greeting = GreetingComponent.render();
      greetingEl.innerHTML = `
        <h1>${greeting.greeting}</h1>
        <p class="date">${greeting.date}</p>
        <p class="time">${greeting.time}</p>
      `;
    } catch (error) {
      console.error('updateGreetingDisplay error:', error);
    }
  }

  /**
   * Updates timer component display
   */
  function updateTimerDisplay() {
    try {
      const timerEl = DOMController.getElement('#timer-display');
      if (!timerEl) return;

      timerEl.textContent = TimerComponent.render();
    } catch (error) {
      console.error('updateTimerDisplay error:', error);
    }
  }

  /**
   * Updates todo list display
   */
  function updateTodoDisplay() {
    try {
      const todoListEl = DOMController.getElement('#task-list');
      if (!todoListEl) return;

      todoListEl.innerHTML = TodoListComponent.render();
    } catch (error) {
      console.error('updateTodoDisplay error:', error);
    }
  }

  /**
   * Updates quick links display
   */
  function updateLinksDisplay() {
    try {
      const linksEl = DOMController.getElement('#links-grid');
      if (!linksEl) return;

      linksEl.innerHTML = QuickLinksComponent.render();
    } catch (error) {
      console.error('updateLinksDisplay error:', error);
    }
  }

  /**
   * Sets up event handlers for user interactions
   */
  function setupEventHandlers() {
    // Task form submission
    const taskForm = DOMController.getElement('#task-form');
    if (taskForm) {
      DOMController.addEventListener(taskForm, 'submit', (e) => {
        e.preventDefault();
        const input = DOMController.getElement('#task-input');
        if (input && input.value.trim()) {
          TodoListComponent.addTask(input.value);
          input.value = '';
          updateTodoDisplay();
          showNotification('Task added', 'success');
        }
      });
    }

    // Link form submission
    const linkForm = DOMController.getElement('#link-form');
    if (linkForm) {
      DOMController.addEventListener(linkForm, 'submit', (e) => {
        e.preventDefault();
        const urlInput = DOMController.getElement('#link-url');
        const labelInput = DOMController.getElement('#link-label');
        const rawUrl = urlInput ? urlInput.value.trim() : '';
        const rawLabel = labelInput ? labelInput.value.trim() : '';
        if (!rawUrl || !rawLabel) {
          showNotification('Please enter both a URL and a label.', 'warning');
          return;
        }
        // Prepend https:// if no protocol given
        const finalUrl = /^https?:\/\//i.test(rawUrl) ? rawUrl : 'https://' + rawUrl;
        try { new URL(finalUrl); } catch (_) {
          showNotification('Please enter a valid URL (e.g. google.com).', 'warning');
          return;
        }
        QuickLinksComponent.addLink(finalUrl, rawLabel);
        urlInput.value = '';
        labelInput.value = '';
        updateLinksDisplay();
        showNotification('Link added', 'success');
      });
    }

    // Timer control buttons
    const startBtn = DOMController.getElement('#timer-start');
    if (startBtn) {
      DOMController.addEventListener(startBtn, 'click', () => {
        TimerComponent.start();
        updateTimerDisplay();
      });
    }

    const pauseBtn = DOMController.getElement('#timer-pause');
    if (pauseBtn) {
      DOMController.addEventListener(pauseBtn, 'click', () => {
        TimerComponent.pause();
        updateTimerDisplay();
      });
    }

    const resumeBtn = DOMController.getElement('#timer-resume');
    if (resumeBtn) {
      DOMController.addEventListener(resumeBtn, 'click', () => {
        TimerComponent.resume();
        updateTimerDisplay();
      });
    }

    const resetBtn = DOMController.getElement('#timer-reset');
    if (resetBtn) {
      DOMController.addEventListener(resetBtn, 'click', () => {
        TimerComponent.reset();
        updateTimerDisplay();
      });
    }

    // Subscribe to component events for real-time updates
    EventBus.subscribe('task:created', () => updateTodoDisplay());
    EventBus.subscribe('task:updated', () => updateTodoDisplay());
    EventBus.subscribe('task:deleted', () => updateTodoDisplay());
    EventBus.subscribe('task:toggled', () => updateTodoDisplay());

    EventBus.subscribe('link:created', () => updateLinksDisplay());
    EventBus.subscribe('link:updated', () => updateLinksDisplay());
    EventBus.subscribe('link:deleted', () => updateLinksDisplay());

    EventBus.subscribe('timer:tick', () => updateTimerDisplay());
    EventBus.subscribe('timer:finished', () => {
      updateTimerDisplay();
      showNotification('Timer finished!', 'info');
    });
    EventBus.subscribe('timer:reset', () => updateTimerDisplay());

    EventBus.subscribe('greeting:updated', () => updateGreetingDisplay());

    // Event delegation on static parent containers – survives re-renders
    const taskList = DOMController.getElement('#task-list');
    if (taskList) {
      taskList.addEventListener('change', (e) => {
        if (e.target.classList.contains('task-checkbox')) {
          const taskId = e.target.closest('[data-task-id]').dataset.taskId;
          TodoListComponent.toggleTask(taskId);
        }
      });
      taskList.addEventListener('click', (e) => {
        const btn = e.target.closest('.task-delete');
        if (btn) {
          const taskId = btn.dataset.taskId;
          TodoListComponent.deleteTask(taskId);
        }
      });
    }

    const linksGrid = DOMController.getElement('#links-grid');
    if (linksGrid) {
      linksGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.link-delete');
        if (btn) {
          e.preventDefault();
          const linkId = btn.dataset.linkId;
          QuickLinksComponent.deleteLink(linkId);
        }
      });
    }
  }

  // Public API
  return {
    initialize,
    showNotification,
    updateDisplay
  };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    App.initialize();
  });
} else {
  // DOM already loaded
  App.initialize();
}
