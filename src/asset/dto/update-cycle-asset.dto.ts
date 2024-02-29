import { ApiProperty } from "@nestjsx/crud/lib/crud";

export class UpdateCycleAsset {
    @ApiProperty()
    idSource: number

    @ApiProperty()
    idDestination: number
}