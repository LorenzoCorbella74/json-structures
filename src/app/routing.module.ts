import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// COMPONENTS
import { ProjectsComponent } from './app/components/projects/projects.component';
import { StructuresComponent } from './app/components/structures/structures.component';
import { LoginComponent } from './app/components/login/login.component';

// SERVICE
import { CanActivateRouteGuard } from './app/services/can-activate-route.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'projects', component: ProjectsComponent, canActivate: [CanActivateRouteGuard] },
  { path: 'structures/:id', component: StructuresComponent, canActivate: [CanActivateRouteGuard] }
];

@NgModule({
  exports: [
    RouterModule
  ],
  imports: [
    RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule { }
