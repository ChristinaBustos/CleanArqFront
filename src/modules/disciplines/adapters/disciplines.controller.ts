import { ApiResponse, PaginationDto } from "@/kernel/types";
import { Discipline } from "../entities/discipline";
import { disciplineRepository } from "../use-cases/ports/disciplines.repository";
import { DisciplineStorageGateway } from "./disciplines.storage.gateway";
import { GetAllDisciplinesInteractor } from "../use-cases/get-disciplines.interactor";
import { SaveDisciplinesDto } from "../entities/save-disciplines.dto";
import { SaveDisciplinesInteractor } from "../use-cases/save-disciplines.interactor";
import { UpdateDisciplineDto } from "../entities/update-disciplines.dto";
import { UpdateDisciplinesInteractor } from "../use-cases/update-disciplines.interactor";
import { ChangeStatusDisciplineDto } from "../entities/change-status-disciplines.dto";
import { ChangesStatusDisciplineInteractor } from "../use-cases/change-status-discipline.interactor";
import { DisciplinesActiveDto } from "../entities/get-disciplinesdto";
import { GetActiveDisciplinesInteractor } from "../use-cases/get-disciplines-active.interactor";

export class DisciplineCohtroller {
    getAllDisciplines(disciplines: PaginationDto): Promise<ApiResponse<Discipline[]>> {
        const disciplineRepository: disciplineRepository = new DisciplineStorageGateway()
        const interactor = new GetAllDisciplinesInteractor(disciplineRepository)
        return interactor.execute(disciplines)
    }

    saveDisciplines(discipline: SaveDisciplinesDto): Promise<ApiResponse<Discipline>> {
        const disciplineRepository: disciplineRepository = new DisciplineStorageGateway()
        const interactor = new SaveDisciplinesInteractor(disciplineRepository)
        return interactor.execute(discipline)
    }

    updateDiscipline(discipline: UpdateDisciplineDto): Promise<ApiResponse<Discipline>> {
        const disciplineRepository: disciplineRepository = new DisciplineStorageGateway()
        const interactor = new UpdateDisciplinesInteractor(disciplineRepository)
        return interactor.execute(discipline)
    }

    changeStatus(discipline: ChangeStatusDisciplineDto): Promise<ApiResponse<Discipline>> {
        const disciplineRepository: disciplineRepository = new DisciplineStorageGateway() 
        const interactor = new ChangesStatusDisciplineInteractor(disciplineRepository)
        return interactor.execute(discipline)
    }

    getDisciplinesActive():Promise<ApiResponse<DisciplinesActiveDto>>{
        const disciplineRepository : disciplineRepository = new DisciplineStorageGateway();
        const interactor =  new GetActiveDisciplinesInteractor(disciplineRepository);
        return interactor.execute();
    }
}