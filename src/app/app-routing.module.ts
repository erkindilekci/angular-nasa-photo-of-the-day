import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { NasaPhotoBodyComponent } from "./components/photo-body/photo-body.component";

const routes: Routes = [
    { path: "apod", component: NasaPhotoBodyComponent },
    { path: "**", redirectTo: "apod" }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

export const appRoutingComponents = [NasaPhotoBodyComponent];
