import { test, expect, describe } from "@jest/globals";
import { micromark } from "micromark";
import { html, syntax } from "./index";
import { defaultOptions, Options } from "./lib/options";

describe("parsing taggabled with default options", () => {
  const options = defaultOptions;

  test("can parse tags into links without Options", () => {
    console.log(
      micromark("#tag", {
        extensions: [syntax()],
        htmlExtensions: [html()],
      }),
    );

    expect(
      micromark("#tag", {
        extensions: [syntax()],
        htmlExtensions: [html()],
      }),
    ).toBe(
      '<p><a href="/tags/tag" class="micromark-taggable tag">#tag</a></p>',
    );
  });

  test("understands punctuation <.>", () => {
    expect(
      micromark("This is #tag. Yes?", {
        extensions: [syntax()],
        htmlExtensions: [html()],
      }),
    ).toBe(
      '<p>This is <a href="/tags/tag" class="micromark-taggable tag">#tag</a>. Yes?</p>',
    );
  });

  test("understands punctuation <!>", () => {
    expect(
      micromark("This is #tag! Yes?", {
        extensions: [syntax()],
        htmlExtensions: [html()],
      }),
    ).toBe(
      '<p>This is <a href="/tags/tag" class="micromark-taggable tag">#tag</a>! Yes?</p>',
    );
  });

  test("understands unicode", () => {
    expect(
      micromark("এটি markdown ব্যবহারের জন্য একটি #পরীক্ষা, তাই কি", {
        extensions: [syntax()],
        htmlExtensions: [html()],
      }),
    ).toBe(
      '<p>এটি markdown ব্যবহারের জন্য একটি <a href="/tags/পরীক্ষা" class="micromark-taggable tag">#পরীক্ষা</a>, তাই কি</p>',
    );
  });

  test("can parse mentions into links without Options", () => {
    expect(
      micromark("@mention", {
        extensions: [syntax()],
        htmlExtensions: [html()],
      }),
    ).toBe(
      '<p><a href="/users/mention" class="micromark-taggable mention">@mention</a></p>',
    );
  });

  test("does not parse incorrect taggable, mention", () => {
    expect(
      micromark("@ mention", {
        extensions: [syntax()],
        htmlExtensions: [html()],
      }),
    ).toBe("<p>@ mention</p>");
  });

  test("does not parse incorrect taggable, tag", () => {
    expect(
      micromark("# mention", {
        extensions: [syntax()],
        htmlExtensions: [html()],
      }),
    ).toBe("<h1>mention</h1>");
  });

  test("can parse tags into links", () => {
    expect(
      micromark("#tag", {
        extensions: [syntax(options)],
        htmlExtensions: [html(options)],
      }),
    ).toBe(
      '<p><a href="/tags/tag" class="micromark-taggable tag">#tag</a></p>',
    );
  });

  test("can parse mentions into links", () => {
    expect(
      micromark("@example", {
        extensions: [syntax(options)],
        htmlExtensions: [html(options)],
      }),
    ).toBe(
      '<p><a href="/users/example" class="micromark-taggable mention">@example</a></p>',
    );
  });
});

describe("parsing taggables with custom options", () => {
  const options: Options = {
    rules: [
      {
        marker: "!",
        type: "toDo",
        toUrl: (val: string) => `/toDo/${val}`,
      },
      {
        marker: "$",
        type: "abs",
        toUrl: (val: string) => `/abs/${val}`,
      },
    ],
    classes: ["micromark-taggable"],
  };

  test("can parse toDo into links", () => {
    expect(
      micromark("!DoThis", {
        extensions: [syntax(options)],
        htmlExtensions: [html(options)],
      }),
    ).toBe(
      '<p><a href="/toDo/DoThis" class="micromark-taggable">!DoThis</a></p>',
    );
  });

  test("can parse abs into links", () => {
    expect(
      micromark("$mathValue", {
        extensions: [syntax(options)],
        htmlExtensions: [html(options)],
      }),
    ).toBe(
      '<p><a href="/abs/mathValue" class="micromark-taggable">$mathValue</a></p>',
    );
  });
});

describe("using custom global class names", () => {
  const options: Options = {
    rules: [
      {
        marker: "#",
        type: "tag",
        toUrl: (val: string) => `/tag/${val}`,
      },
      {
        marker: "@",
        type: "mention",
        toUrl: (val: string) => `/user/${val}`,
      },
    ],
    classes: ["custom", "bespoke"],
  };

  test("can parse tags into links", () => {
    expect(
      micromark("#tag", {
        extensions: [syntax(options)],
        htmlExtensions: [html(options)],
      }),
    ).toBe('<p><a href="/tag/tag" class="custom bespoke">#tag</a></p>');
  });

  test("can parse mentions into links", () => {
    expect(
      micromark("@example", {
        extensions: [syntax(options)],
        htmlExtensions: [html(options)],
      }),
    ).toBe(
      '<p><a href="/user/example" class="custom bespoke">@example</a></p>',
    );
  });
});

describe("using custom global/local class names", () => {
  const options = {
    rules: [
      {
        marker: "#",
        type: "tag",
        toUrl: (val: string) => `/tag/${val}`,
        classes: ["tagged"],
      },
      {
        marker: "@",
        type: "mention",
        toUrl: (val: string) => `/user/${val}`,
        classes: ["mentioned"],
      },
    ],
    classes: ["custom", "bespoke"],
  };

  test("can parse tags into links", () => {
    expect(
      micromark("#tag", {
        extensions: [syntax(options)],
        htmlExtensions: [html(options)],
      }),
    ).toBe('<p><a href="/tag/tag" class="custom bespoke tagged">#tag</a></p>');
  });

  test("can parse mentions into links", () => {
    expect(
      micromark("@example", {
        extensions: [syntax(options)],
        htmlExtensions: [html(options)],
      }),
    ).toBe(
      '<p><a href="/user/example" class="custom bespoke mentioned">@example</a></p>',
    );
  });
});

describe("parsing taggables with emailAllowed as True", () => {
  const options: Options = {
    rules: [
      {
        marker: "@",
        type: "mention",
        toUrl: (val: string) =>
          `/users/${val.replace("@", "-at-").replace(".", "_")}`,
      },
      {
        marker: "#",
        type: "tag",
        toUrl: (val: string) => `/tags/${val}`,
      },
    ],
    allowEmail: true,
    classes: ["micromark-taggable"],
  };

  test("can parse mentions into links with emailAllowed", () => {
    expect(
      micromark("@username", {
        extensions: [syntax(options)],
        htmlExtensions: [html(options)],
      }),
    ).toBe(
      '<p><a href="/users/username" class="micromark-taggable">@username</a></p>',
    );
  });

  test("can parse mentions into links with emailAllowed", () => {
    expect(
      micromark("@RanDomUser@Gmail.com", {
        extensions: [syntax(options)],
        htmlExtensions: [html(options)],
      }),
    ).toBe(
      '<p><a href="/users/RanDomUser-at-Gmail_com" class="micromark-taggable">@RanDomUser@Gmail.com</a></p>',
    );
  });
});
