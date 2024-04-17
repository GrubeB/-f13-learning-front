import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OutsideClickDirective } from '../../directive/outside-click.directive';
import { NGXLogger } from 'ngx-logger';
import { mergeDeep } from '../../utils/merge';
import uuid from 'uuid-random';

@Component({
  selector: 'app-tiered-select',
  standalone: true,
  imports: [
    CommonModule,
    OutsideClickDirective
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TieredSelectComponent),
      multi: true
    }
  ],
  templateUrl: './tiered-select.component.html',
  styleUrl: './tiered-select.component.scss'
})
export class TieredSelectComponent implements ControlValueAccessor, OnInit {
  logger = inject(NGXLogger);

  selectedItem: any;
  selectedItemGroup: any;

  isDisabled: boolean = false;
  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(obj: any): void {
    this.selectedItem = obj
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  ngOnInit(): void {
    this.baseInit();
  }

  baseInit() {
    this.selectedGroups = [this._config.group];
    this.activeGroup = this._config.group;
  }

  // ITEM
  setSelectedItem(item: any) {
    this.selectedItem = item;
    this.selectedItemGroup = this.activeGroup;
  }
  getItemsToDisplay(): any[] {
    if (this.activeGroup) {
      return this.activeGroup?.itmes ?? [];
    }
    return [];
  }
  // GROUP
  selectedGroups: Group[] = [];
  activeGroup!: Group;

  selectGroup(groupId?: string | undefined) {
    this.logger.debug(TieredSelectComponent.name, " selectGroup()", groupId);
    if (!groupId) {
      this.baseInit();
      return;
    }
    const newGroup = this.findGroupById(groupId);
    if (newGroup) {
      this.selectedGroups = this.getSelectedGroupsForGroup(newGroup);
      this.activeGroup = newGroup;
      return;
    }
  }
  getSelectedGroupsForGroup(group: Group): Group[] {
    let parents = []; let p: Group | null = group;
    while ((p = this.findParentGroup(p)) != null) {
      parents.push(p);
    }
    let selectedGroups = [];
    for (let index = parents.length - 1; index >= 0; index--) {
      selectedGroups.push(parents[index]);
    }
    selectedGroups.push(group);
    return selectedGroups;
  }

  getGroupsToDisplay(): Group[] {
    return this.activeGroup?.groups ?? [];
  }

  findGroupById(groupId: string, groups?: Group[]): Group | null {
    if (!groupId) {
      return null;
    }
    if (!groups) {
      groups = [this._config.group];
    }
    for (const group of groups) {
      if (group.groupId === groupId) {
        return group;
      }
      if (group.groups) {
        const foundInSubgroup = this.findGroupById(groupId, group.groups);
        if (foundInSubgroup) {
          return foundInSubgroup;
        }
      }
    }
    return null;
  }
  findParentGroup(group: Group, groups?: Group[]): Group | null {
    if (!groups) {
      groups = [this._config.group];
    }
    for (const parentGroup of groups) {
      if (parentGroup.groups && parentGroup.groups.includes(group)) {
        return parentGroup;
      }
      if (parentGroup.groups) {
        const foundInSubgroup = this.findParentGroup(group, parentGroup.groups);
        if (foundInSubgroup) {
          return foundInSubgroup;
        }
      }
    }
    return null;
  }

  // VISABILITY  
  menuVisable: boolean = false;
  openMenu() {
    this.menuVisable = true;
  }
  hideMenu() {
    this.menuVisable = false;
  }

  // CONFIG
  @Input() set config(config: any) {
    // set gropId for all groups
    this._config = mergeDeep(this._config, config);
  }
  _config: Config = {
    group: {
      groupId: uuid(),
      groupLabel: 'G0',
      groups: [
        {
          groupId: uuid(),
          groupLabel: 'G1',
          groups: [
            {
              groupId: uuid(),
              groupLabel: 'G11',
              itmes: [{ id: '123', name: 'i1' }],
              itemPropertyLabel: 'name',
            },
          ]
        },
        {
          groupId: uuid(),
          groupLabel: 'G2',
          itmes: [{ id: '1232', name: 'i2' }],
          itemPropertyLabel: 'name',
        }
      ],
    }
  }

}

class Config {
  group!: Group;
}
class Group {
  groupId!: string;
  groupLabel!: string;
  groups?: Group[];
  itmes?: any[];
  itemPropertyLabel?: string;
}