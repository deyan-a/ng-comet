import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
    selector: 'app-table-with-sorting',
    templateUrl: './table-with-sorting.component.html',
    styleUrls: ['./table-with-sorting.component.scss'],
})

export class TableWithSortingComponent implements OnInit {

    @Input() public  data;
    @Input() public  displayedColumns = [];
    @Input() public  buttonColumns = [];
    @Input() public buttonDef = [];
    @Input() public truncCols = new Set([]);
    @ViewChild(MatSort) public  sort: MatSort;
    @ViewChild(MatPaginator) public paginator: MatPaginator;
    @Output() public  actionButtonClicked = new EventEmitter();
    public dataSource: MatTableDataSource<any>;
    public allColumns = [];

    public ngOnInit(): void {
        this.allColumns = [...this.displayedColumns, ...this.buttonColumns];
        this.dataSource = this.data;
    }

    /**
     * Set the sort after the view init since this component will
     * be able to query its view for the initialized sort.
     */
    public isDateCol(column: string): boolean {
        return column === 'createdAt' ? true : false;
    }

    public isIdCol(column: string): boolean {
        return column === '_id' ? true : false;
    }

    public ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    public onActionButtonClick(action: any, id: string): void {
        this.actionButtonClicked.emit({ action, id });
  }
}