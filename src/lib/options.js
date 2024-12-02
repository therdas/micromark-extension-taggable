export const defaultOptions = {
  classes: ["micromark-taggable"],
  rules: [
    {
      marker: "#",
      type: "tag",
      toUrl: (val) => `/tags/${val}`,
      classes: ["tag"],
    },
    {
      marker: "@",
      type: "mention",
      toUrl: (val) => `/users/${val}`,
      classes: ["mention"],
    },
  ],
  allowEmail: false,
};
