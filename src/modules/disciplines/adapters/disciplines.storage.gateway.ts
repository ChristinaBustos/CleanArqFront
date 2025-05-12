import { ApiResponse, PaginationDto, TypesResponse } from "@/kernel/types";
import { Discipline } from "../entities/discipline";
import { disciplineRepository } from "../use-cases/ports/disciplines.repository";
import { handleRequest } from '@/config/http-client.gateway'
import { SaveDisciplinesDto } from "../entities/save-disciplines.dto";
import { UpdateDisciplineDto } from "../entities/update-disciplines.dto";
import { ChangeStatusDisciplineDto } from "../entities/change-status-disciplines.dto";
import { DisciplinesActiveDto } from "../entities/get-disciplinesdto";

export class DisciplineStorageGateway implements disciplineRepository {
    getActiveDiscipline(): Promise<ApiResponse<DisciplinesActiveDto>> {
        return handleRequest<DisciplinesActiveDto>('get','/disciplines/paged/active')
    }
    async getAllDisciplines(disciplines: PaginationDto): Promise<ApiResponse<Discipline[]>> {
        return handleRequest<Discipline[], PaginationDto>('post', '/disciplines/paged', disciplines)
    }

    async saveDiscipline(discipline: SaveDisciplinesDto): Promise<ApiResponse<Discipline>> {
        return handleRequest<Discipline, SaveDisciplinesDto>('post', '/disciplines/', discipline)
    }

    async updateDiscipline(discipline: UpdateDisciplineDto): Promise<ApiResponse<Discipline>> {
        return handleRequest<Discipline, UpdateDisciplineDto>('put', '/disciplines/', discipline)
    }

    async changeStatusDiscipline(discipline: ChangeStatusDisciplineDto): Promise<ApiResponse<Discipline>> {
        return handleRequest<Discipline, ChangeStatusDisciplineDto>('patch', '/disciplines/change/status', discipline)
    }
}