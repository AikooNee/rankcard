declare module "rc-color" {
  export function getColorFromURL(url: string): Promise<[number, number, number]>;
}