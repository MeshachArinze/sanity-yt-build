import {
  createClient,
} from "next-sanity";

import createImageUrlBuilder from "@sanity/image-url";

import config from "./config";

export const urlFor = (source) => createImageUrlBuilder(config).image(source);


export const sanityclient = createClient(config);


