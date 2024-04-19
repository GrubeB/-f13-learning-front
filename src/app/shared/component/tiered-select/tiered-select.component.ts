import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, forwardRef, inject } from '@angular/core';
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
  onChange: any = () => { };
  onTouch: any = () => { };

  ngOnInit(): void {
    this.baseInit();
  }

  writeValue(obj: any): void {
    if (obj instanceof TieredSelectValue) {
      this.selectedItemGroup = this.findGroupById(obj.groupId); 
      this.selectedItem = obj.item;
      return;
    }
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

  baseInit() {
    this.selectedGroups = [this._config.group];
    this.activeGroup = this._config.group;
  }

  // ITEM
  setSelectedItem(item: any) {
    this.logger.debug(TieredSelectComponent.name, " setSelectedItem()");
    this.selectedItem = item;
    this.selectedItemGroup = this.activeGroup;
    this.onChange(new TieredSelectValue(this.selectedItemGroup.groupId, this.selectedItem));
    this.hideMenu();
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
  @Input() set config(c: any) {
    this.logger.debug(TieredSelectComponent.name, "set config", c);
    this._config = mergeDeep(this._config, c);
    this.setIdToGroups(this._config.group);
  }
  private setIdToGroups(group: Group) {
    if (group) {
      if (!group.groupId) {
        group.groupId = uuid();
      }
      if (group.groups) {
        for (let index = 0; index < group.groups?.length; index++) {
          this.setIdToGroups(group.groups[index]);
        }
      }
    }
  }
  _config: Config = {
    group: new Group()
  }

}
export class TieredSelectValue {
  groupId!: string;
  item!: any;
  constructor(groupId: string, item: any) {
    this.groupId = groupId;
    this.item = item;
  }
}
export class Config {
  group!: Group;
}
class Group {
  groupId!: string;
  groupLabel!: string;
  groups?: Group[];
  itmes?: any[];
  itemPropertyLabel?: string;
}