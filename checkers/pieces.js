class Pieces{
    constructor(parent,int_team,width,i_,j_){
        this.parent = parent;
        this.team = int_team;
        this.width = width;
        this.hover = false;
        this.selected = false;
        this.i = i_;
        this.j = j_; 
    }

    x(){
        return this.i*this.width+(this.width/2);
    }
    y(){
        return this.j*this.width+(this.width/2);
    }

    dir(){
        switch(this.team){
            case 0:
                return -1;
            case 1:
                return 1;
        }
    }



    CheckHover(){
        let radius = this.width*0.4;

        let dx = this.x()-mouseX;
        let dy = this.y()-mouseY;

        let dist = sqrt(
            (dx*dx)+(dy*dy)
        );

        this.hover = (dist <=radius);

        return this.hover;
    }

    Display(){

        this.CheckHover();
        switch(this.team){
            case 0:
                fill(210, 179, 162);
                break;
            case 1:
                fill(199, 138, 140);
                break;
        }     

        rectMode(RADIUS);
        rect(this.x(),this.y(),this.width*0.4,this.width*0.4,30)

        if(this.hover){
            fill(0,0,0,100);
            rect(this.x(),this.y(),this.width*0.4,this.width*0.4,30)
        }
        if(this.selected){
            fill(0,255,0,100);
            rect(this.x(),this.y(),this.width*0.4,this.width*0.4,30)
        }
    }
}