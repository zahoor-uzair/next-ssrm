import React, { useCallback, useMemo, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  ColDef,
  GridReadyEvent,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  SideBarDef,
  RowModelType,
} from "@ag-grid-community/core";
import "ag-grid-enterprise";
import { LicenseManager } from "ag-grid-enterprise";
import { IOlympicData } from "./olumpicInterface";
import { ModuleRegistry } from "@ag-grid-community/core";
import { SideBarModule } from "@ag-grid-enterprise/side-bar";
import { ServerSideRowModelModule } from "@ag-grid-enterprise/server-side-row-model";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import { FiltersToolPanelModule } from "@ag-grid-enterprise/filter-tool-panel";

ModuleRegistry.registerModules([
  FiltersToolPanelModule,
  ColumnsToolPanelModule,
  ServerSideRowModelModule,
  SideBarModule,
]);

const aggridKey = process.env["NEXT_PUBLIC_AGGRID_LICENCE_KEY"] || "";
console.log(aggridKey);
LicenseManager.setLicenseKey(aggridKey);

export const GridExampleThree = () => {
  const containerStyle = useMemo(
    () => ({ width: "100%", height: "100vh" }),
    []
  );
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs] = useState<ColDef[]>([
    { field: "athlete", minWidth: 220 },
    { field: "country", minWidth: 200 },
    {
      field: "year",
      filter: "agNumberColumnFilter",
      filterParams: {
        buttons: ["reset"],
      },
    },
    { field: "sport", minWidth: 200 },
    {
      field: "date",
    },
    { field: "gold", filter: false },
    { field: "silver", filter: false },
    { field: "bronze", filter: false },
    { field: "total", filter: false },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      sortable: true,
      filter: true,
      // floatingFilter: true,
      minWidth: 100,
      resizable: true,
      enableValue: true,
      enableRowGroup: true,
      enablePivot: true,
    };
  }, []);

  const getServerSideDatasource: IServerSideDatasource = {
    getRows: (params: IServerSideGetRowsParams) => {
      // console.log("[Datasource] - rows requested by grid: ", params.request);
      const { startRow, endRow, filterModel, sortModel } = params.request;
      console.log(startRow, endRow, filterModel, sortModel);
      let url = `/api/hello?`;
      //Sorting
      if (sortModel.length) {
        const { colId, sort } = sortModel[0];
        url += `sort=${colId}&order=${sort}&`;
      }
      //Filtering
      const filterKeys = Object.keys(filterModel);
      console.log(filterKeys);
      filterKeys.forEach((filter) => {
        url += `${filter}=${filterModel[filter].filter}&`;
        console.log(url);
      });
      //Pagination
      url += `startRow=${startRow}&endRow=${endRow}`;
      fetch(url) // Adjust the API route as needed
        .then((resp) => resp.json())
        .then((response) => {
          if (response) {
            // supply rows for requested block to grid
            params.success({
              rowData: response.olympicData,
              rowCount: response.dataLength,
            });
          } else {
            params.fail();
          }
        });
    },
  };
  const sideBar = useMemo<
    SideBarDef | string | string[] | boolean | null
  >(() => {
    return {
      toolPanels: [
        {
          id: "columns",
          labelDefault: "Columns",
          labelKey: "columns",
          iconKey: "columns",
          toolPanel: "agColumnsToolPanel",
          minWidth: 225,
          width: 225,
          maxWidth: 225,
        },
        {
          id: "filters",
          labelDefault: "Filters",
          labelKey: "filters",
          iconKey: "filter",
          toolPanel: "agFiltersToolPanel",
          minWidth: 225,
          width: 225,
          maxWidth: 225,
        },
      ],
      position: "right",
      defaultToolPanel: "filters",
    };
  }, []);
  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api!.setServerSideDatasource(getServerSideDatasource);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-alpine-dark">
        <AgGridReact<IOlympicData>
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowModelType={"serverSide"}
          animateRows={true}
          sideBar={sideBar}
          cacheBlockSize={50}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};
