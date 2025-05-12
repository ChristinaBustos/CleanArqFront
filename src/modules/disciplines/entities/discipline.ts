import { Entity } from "@/kernel/types";
import { Type } from "./type";
import { Category } from "./category";

export type Discipline = Entity<number> & {
    id: number,
    name: string,
    description: string | null,
    type: Type,
    category: Category,
    status: boolean
    disciplineImage: string,
    createdAt: Date | null,
}