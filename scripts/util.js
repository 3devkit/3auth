export const showBuildLog = (type, ...arg) => {
  console.log(`[ build ] ${type} `, ...arg);
};

export const showPublishLog = (type, ...arg) => {
  console.log(`[ publish ] ${type} `, ...arg);
};
