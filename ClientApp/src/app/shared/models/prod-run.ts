export interface ProdRunModel {
    item: string;
    actualQuantity: string;
    capacityQuantity: string;
    headerId: string;
    planQuantity: string;
    productCode: string;
    productDesc: string;
    productId: string;
    runDuration: string;
    runId: string;
    sequenceNumber: string;
}
export interface ProdrunDownTimesModel {
    item: string;
    downtimeDuration: any;
    downtimeId: any;
    downtimeReasonDesc: any;
    downtimeReasonDetailDesc: any;
    downtimeReasonDetailId: any;
    downtimeReasonId: any;
    headerId: any;
    labourReleased: any;
    sequenceNumber: any;
    downtimeReasonCodes:any[];
    downtimeReasonDetails:any[];
}


