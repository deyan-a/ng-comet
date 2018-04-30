import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { HomeResolver } from './shared/home-resolver.service';

const homeRoutes: Routes = [{
    path: 'home',
    resolve: { links: HomeResolver },
    component: HomeComponent
}, ];

@NgModule({
    imports: [
        RouterModule.forChild(homeRoutes)
    ],
    exports: [RouterModule]
})
export class HomeRoutingModule {}
