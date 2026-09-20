export const formValidate = (data) => {
  for (const key in data) {
    if (data[key].trim() === "") {
      return { message: `${key} is required` };
    }
  }
  return { message: "success" };
};
