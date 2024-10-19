const getDuration = (from, to) => {
    let start = new Date(from);
    let end = new Date(to);
    return (end - start) / (1000 * 60 * 60); 
};

const calculateTotalHours = (tasks) => {
    return tasks.reduce((total, task) => {
        return total + getDuration(task.from, task.to);
    }, 0);
};

module.exports = {
    getDuration,
    calculateTotalHours
};
