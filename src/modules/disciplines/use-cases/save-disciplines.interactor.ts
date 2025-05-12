import { UseCase } from "@/kernel/contract";
import { SaveDisciplinesDto } from "../entities/save-disciplines.dto";
import { Discipline } from "../entities/discipline";
import { disciplineRepository } from "./ports/disciplines.repository";
import { ApiResponse } from "@/kernel/types";

export class SaveDisciplinesInteractor implements UseCase<SaveDisciplinesDto, ApiResponse<Discipline>> {
    constructor(private readonly disciplineRepository: disciplineRepository) {}

    async execute(discipline: SaveDisciplinesDto): Promise<ApiResponse<Discipline>> {
        return await this.disciplineRepository.saveDiscipline(discipline)
    }
}