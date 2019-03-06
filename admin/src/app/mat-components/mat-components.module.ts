import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@NgModule({
	exports:
		[ MatIconModule, MatTabsModule, MatTableModule, MatSortModule, MatButtonModule, MatDividerModule, MatListModule ]
})
export class MatComponentsModule {}
