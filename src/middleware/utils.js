const checkParameters = (bodyObject, parameterArray) => {
    const updates = Object.keys(bodyObject);
    const allowedUpdates = parameterArray;

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
   
    if (!isValidOperation) {
        return false;
    }
    else {
        return true;
    }
}

module.exports = { checkParameters };