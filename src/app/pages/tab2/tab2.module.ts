import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from 'src/app/explore-container/explore-container.module';
import { Tab2PageRoutingModule } from './tab2-routing.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PipesModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule,
    CommonModule,
    RouterModule.forChild([{path: '', component: Tab2Page}])
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}