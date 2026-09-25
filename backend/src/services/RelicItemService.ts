import { relicItemRepository } from "../repositories/RelicItemRepository";
import { createRelicItemDto } from "../constructors/RelicItemDtoFactory";
import type { RelicItem } from "../models/RelicItem";

export const relicItemService = {
  list: (): RelicItem[] => relicItemRepository.findAll(),
  create: (row: unknown) => relicItemRepository.save(createRelicItemDto(row as Partial<RelicItem>))
};
