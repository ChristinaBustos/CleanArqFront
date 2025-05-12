import { UseCase } from "@/kernel/contract";
import { Discipline } from "../entities/discipline";
import { ApiResponse } from "@/kernel/types";
import { DisciplinesActiveDto } from "../entities/get-disciplinesdto";
import { disciplineRepository } from "./ports/disciplines.repository";

export class GetActiveDisciplinesInteractor implements UseCase<Discipline,ApiResponse<DisciplinesActiveDto>>{
    constructor(private readonly disciplinesRepository: disciplineRepository){}
    execute(): Promise<ApiResponse<DisciplinesActiveDto>> {
        return this.disciplinesRepository.getActiveDiscipline();
    }

}