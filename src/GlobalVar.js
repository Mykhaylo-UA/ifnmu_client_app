export const Faculty = {
    Medicine: 0,
    ShortMedicine: 1,
    Paramedic: 2,
    Nurse: 3,
    Pediatric: 4,
    Stomatology:5,
    Ortopedic:6,
    Ortopedic11:7,
    Farmacy:8,
    Farmacy9:9,
    Farmacy11:10,
    Reabilitology:11,
    Foreigners:12,
    ShortStomatology: 13,
    ShortFarmacy: 14
}

export const getFacultyName = number=>{
    switch(number){
        case 0: return "Медицина"
        case 1: return "Скорочена медицина"
        case 2: return "Фельдшера"
        case 3: return "Сестринська справа"
        case 4: return "Педіатрія"
        case 5: return "Стоматологія"
        case 6: return "Зубні техніки (9 клас)"
        case 7: return "Зубні техніки (11 клас)"
        case 8: return "Фармація"
        case 9: return "Фармація (9 клас)"
        case 10: return "Фармація (11 клас)"
        case 11: return "Реабілітологія"
        case 12: return "Іноземці"
        case 13: return "Скорочена стоматологія"
        case 14: return "Скорочена фармація"
        default:return "Невідомо"
    }
}
export const getScheduleType = number =>{
    switch(number){
        case 1: return "Повний"
        case 0: return "1/2 тиждень"
        default: return "Невідомо"
    }
}

export const getWeekType = number =>{
    switch(number){
        case 1: return "З датою"
        case 0: return "1/2 тиждень"
        default: return "Невідомо"
    }
}

export const minMaxDate={
    min: new Date(2021,0,11),
    max: new Date(2021,5,19)
}

export const URL_API = "http://ifnmu.co.ua/api"//"https://localhost:5001/api"//"http://ifnmu.co.ua/api"
