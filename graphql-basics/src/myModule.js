const message = 'Some message from myModule.js';

const location = "Philadelphia";

// Named export, has a name, can have as many as needed. 
// export { message };

const getGreeting = message => {
    return `Hello ${message}`;
}


// Default:Not named, can only have one. 
export { message, location as default, getGreeting };