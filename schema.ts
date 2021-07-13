import * as yup from 'yup';
import * as fs from "fs";
import { parse } from "yaml";

const downloadConfigSchema = yup.object({
  url: yup.string().defined(),
  file: yup.string().defined(),
}).defined();

export const provisionConfigSchema = yup.object({
  reinstall: yup.boolean().default(false).defined(),
  downloads: yup.array(downloadConfigSchema).default([]).defined(),
}).defined();


export type ProvisionConfig = yup.InferType<typeof provisionConfigSchema>;
export type DownloadConfig = yup.InferType<typeof downloadConfigSchema>;

export function loadProvision(file: string) {
  const rawConfig = parse(fs.readFileSync(file, 'utf-8'));
  provisionConfigSchema.validate(rawConfig);
  return provisionConfigSchema.cast(rawConfig);
}