import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

export interface SubPanelChangeListener {
    subPanelSelectionChanged(newSelectedSubPanelId: string);
}

@Injectable()
export class SubPanelService {

    private subPanelGroupIdToSubjectMap = new Map<string, Subject<string>>();
    private subPanelGroupIdToSelectedSubPanelIdMap = new Map<string, string>();

    private getSubject(subPanelGroupId: string): Subject<string> {
        var rslt = this.subPanelGroupIdToSubjectMap.get(subPanelGroupId);
        if (!rslt) {
            rslt = new Subject<string>();
            this.subPanelGroupIdToSubjectMap.set(subPanelGroupId, rslt);
        }
        return rslt;
    }

    public subPanelSelectionChange(subPanelGroupId: string, newSelectedSubPanelId: string): void {
        this.subPanelGroupIdToSelectedSubPanelIdMap.set(subPanelGroupId, newSelectedSubPanelId);
        var subject = this.getSubject(subPanelGroupId);
        subject.next(newSelectedSubPanelId);
    }

    public getSelectedSubPanel(subPanelGroupId: string): string {
        var rslt = this.subPanelGroupIdToSelectedSubPanelIdMap.get(subPanelGroupId);
        return (rslt) ? rslt : null;
    }

    public subscribeSubPanelSelectionChange(subPanelGroupId: string, listener: SubPanelChangeListener): Subscription {
        var rslt = this.getSelectedSubPanel(subPanelGroupId);
        return this.getSubject(subPanelGroupId).subscribe( (item: string) => {
            console.log("Notify listener " + subPanelGroupId + " : " + item);
            listener.subPanelSelectionChanged(item);
        } );
    }

    public unsubscribeSubPanelSelectionChange(subPanelGroupId: string, subscription: Subscription): void {
        subscription.unsubscribe();
    }

}