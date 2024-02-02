export const patternSession = new RegExp(
    "var uid_ext_session = '(.*)';\\n.*var frontaddr = '(.*)';"
);

export const issues = "https://github.com/jgoralcz/aki-api/issues";

export const jQuery = "jQuery331023608747682107778_";

export const noUriMsg =
    "Could not find the uri or UrlApiWs. This most likely means that you have not started the game!";
export const noSessionMsg =
    "Could not find the game session. Please make sure you have started the game!";

export const regions = ["en", "en_objects", "en_animals"] as const;

export type region = (typeof regions)[number];
