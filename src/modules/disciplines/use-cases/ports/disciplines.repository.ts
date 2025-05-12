import { ApiResponse, PaginationDto } from "@/kernel/types";
import { Discipline } from "../../entities/discipline";
import { SaveDisciplinesDto } from "../../entities/save-disciplines.dto";
import { UpdateDisciplineDto } from "../../entities/update-disciplines.dto";
import { ChangeStatusDisciplineDto } from "../../entities/change-status-disciplines.dto";
import { DisciplinesActiveDto } from "../../entities/get-disciplinesdto";

export interface disciplineRepository {
    getAllDisciplines(disciplines: PaginationDto): Promise<ApiResponse<Discipline[]>>
    saveDiscipline(discipline: SaveDisciplinesDto): Promise<ApiResponse<Discipline>>
    updateDiscipline(discipline: UpdateDisciplineDto): Promise<ApiResponse<Discipline>>
    changeStatusDiscipline(discipline: ChangeStatusDisciplineDto): Promise<ApiResponse<Discipline>>
    getActiveDiscipline():Promise<ApiResponse<DisciplinesActiveDto>>    
}