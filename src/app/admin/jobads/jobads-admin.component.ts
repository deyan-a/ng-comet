import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmActionModalComponent } from '../../shared/components/';
import { JobAd } from '../../shared/models';
import { JobadsService } from '../../shared/services/jobads';
import { JobadAdminModalComponent } from './jobad-admin-modal';

@Component({
    selector: 'app-jobads-admin',
    templateUrl: './jobads-admin.component.html',
    styleUrls: ['./jobads-admin.component.scss'],
})

export class JobadsAdminComponent implements OnInit, OnDestroy {

    public displayedColumns = ['_id', 'title', 'createdAt'];
    public buttonColumns = ['view', 'edit', 'delete'];
    public truncCols = new Set(['_id']);
    public buttonDef = [
        {
            action: 'view',
            color: 'primary',
        },
        {
            action: 'edit',
            color: 'primary',
        },
        {
            action: 'delete',
            color: 'warn',
        },
    ];
    public jobAds;
    public jobAdsModalSubject = new Subject();
    public confirmModalSubject = new Subject();
    public subscriptions: Subscription[] = [];

    constructor(
        private jobadsService: JobadsService,
        private route: ActivatedRoute,
        public modalService: MatDialog,
    ) { }

    public ngOnInit(): void {
        this.route.data.subscribe(
            (data: {
                jobAds: JobAd[];
            }) => {
                this.jobAds = new MatTableDataSource(data.jobAds);
            });

        const jobAdsModalsubscription = this.jobAdsModalSubject.subscribe((event: {
            action: string;
            formValue: any;
            modalData: any;
        }) => {

            if (event.action === 'Create') {
                this.onCreate(event.formValue);
            } else if (event.action === 'Edit') {
                this.onEdit(event.modalData.jobAd, event.formValue);
            }
        });

        const confirmModalSubscription = this.confirmModalSubject.subscribe((event: {
            actionToConfirm: string;
            modalData: any;
        }) => {
            if (event.actionToConfirm === 'Delete') {
                this.onDelete(event.modalData.jobAd);
            }
        });

        this.subscriptions.push(jobAdsModalsubscription);
        this.subscriptions.push(confirmModalSubscription);
    }

    public onAction(event: any): void {
        const jobAd = this.jobAds.data.find((x) => x._id === event.id);

        if (event.action === 'view') {
            this.openModal(
                {
                    modalTitle: 'Preview JobAd',
                    modalActionButton: 'Preview',
                    jobAd,
                    subject: this.jobAdsModalSubject,
                },
                JobadAdminModalComponent);
        }
        if (event.action === 'edit') {
            this.openModal(
                {
                    modalTitle: 'Edit a JobAd',
                    modalActionButton: 'Edit',
                    jobAd,
                    subject: this.jobAdsModalSubject,
                },
                JobadAdminModalComponent);

        }
        if (event.action === 'delete') {
            this.openModal(
                {
                    modalMsg: 'Are you sure?',
                    actionToConfirm: 'Delete',
                    subject: this.confirmModalSubject,
                    jobAd,
                },
                ConfirmActionModalComponent);
        }
    }

    public openModal(data: any, modalComponent: any): MatDialogRef<any> {
        const dialogRef = this.modalService.open(modalComponent, {
            minWidth: '300px',
            width: '30%',
            data,
        });

        return dialogRef;
    }

    public onOpenCreate(): void {
        this.openModal(
            {
                modalTitle: 'Create a JobAd',
                modalActionButton: 'Create',
                subject: this.jobAdsModalSubject,
            },
            JobadAdminModalComponent);
    }

    public onCreate(jobAd: any): void {
        this.jobadsService.createJobAd(jobAd).subscribe(
            (data) => {
                this.jobAds.data = [...this.jobAds.data, data];
                this.modalService.closeAll();
            },
            (err) => {
                alert(err);
            });
    }

    public onEdit(jobAd: JobAd, updatedInfo: any): void {

        // deep copy current jobAd
        const newJobAd = { ...jobAd };

        // mutate the new jobAd
        Object.keys(updatedInfo).forEach((key) => {
            newJobAd[key] = updatedInfo[key];
        });

        this.jobadsService.editJobAd(newJobAd).subscribe(
            (data) => {
                // mutate old jobad to match the updated one
                Object.keys(data).forEach((key) => {
                    jobAd[key] = data[key];
                    this.modalService.closeAll();
                });
            },
            (err) => {
                alert(err);
            });
    }

    public onDelete(jobAd: JobAd): void {
        this.jobadsService.deleteJobAd(jobAd._id).subscribe((res) => {
            this.jobAds.data = this.jobAds.data.filter((x) => x._id !== jobAd._id);
            this.modalService.closeAll();
        });
    }

    public ngOnDestroy(): void {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
}