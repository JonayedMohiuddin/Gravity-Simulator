export class Camera
{
    constructor(ctx, cw, ch) {
        this.ctx = ctx;
        this.canvasWidth = cw;
        this.canvasHeight = ch;
        this.x = 0;
        this.y = 0;
        this.zoom = 1;
        this.speed = 10;
        this.objectFollowing = null;
        this.objectFollowingIndex = -1;
    }

    updateCamera()
    {
        if(this.objectFollowing != null) 
        {
            this.setCameraXY(this.objectFollowing.x - this.lengthToCanvasUnit(this.canvasWidth/2), this.objectFollowing.y - this.lengthToCanvasUnit(this.canvasHeight/2));
        }
    }

    resetCamera()
    {
        this.x = 0;
        this.y = 0;
        this.zoom = 1;
        this.speed = 10;
        this.objectFollowing = null;
        this.objectFollowingIndex = -1;
    }

    followObject(obj, index = 0) // 0 also if single object
    {
        this.objectFollowing = obj;
        this.objectFollowingIndex = index;
    }

    unfollowObject()
    {
        this.objectFollowing = null;
        this.objectFollowingIndex = -1;
    }

    lenghtToCameraUnit(length)
    {
        return length * this.zoom;
    }

    lengthToCanvasUnit(length)
    {
        return length / this.zoom;
    }

    getZoom()
    {
        console.log(this.zoom);
        return this.zoom;
    }

    setZoom(val)
    {
        if(val > 0.1 && val <= 10)
        {
            this.zoom = val;
        }
    }

    zoomInAroundCenter(newZoomValue)
    {
        if(newZoomValue > 0 && newZoomValue <= 10)
        {
            
        }
    }
    
    zoomOutAroundCenter(newZoomValue)
    {
        if(newZoomValue > 0 && newZoomValue <= 10)
        {
            
        }
    }

    getCameraCordX(x)
    {
        return this.x + (x) / this.zoom;
    }

    getCameraCordY(y)
    {
        return this.y + (y) / this.zoom;
    }

    setCameraX(x)
    {
        this.x = x;
    }

    setCameraY(y)
    {
        this.y = y;
    }

    setCameraXY(x, y)
    {
        this.x = x;
        this.y = y;
    }    
    
    shiftCameraUpBy(value)
    {
        this.unfollowObject();
        this.y -= value;
    }

    shiftCameraDownBy(value)
    {
        this.unfollowObject();
        this.y += value;
    }

    shiftCameraLeftBy(value)
    {
        this.unfollowObject();
        this.x -= value;
    }

    shiftCameraRightBy(value)
    {
        this.unfollowObject();
        this.x += value;
    }

    shiftCameraUp()
    {
        this.unfollowObject();
        this.y -= this.speed / this.zoom;
        console.log(this.x , this.y);
    }

    shiftCameraDown()
    {
        this.unfollowObject();
        this.y += this.speed / this.zoom;
        console.log(this.x , this.y);
    }

    shiftCameraLeft()
    {
        this.unfollowObject();
        this.x -= this.speed / this.zoom;
        console.log(this.x , this.y);
    }

    shiftCameraRight()
    {
        this.unfollowObject();
        this.x += this.speed / this.zoom;
        console.log(this.x , this.y);
    }

    changeCameraSpeed(value)
    {
        this.speed += value;
    }

    drawCircle(x, y, radius, fill) {
        this.ctx.beginPath();
        this.ctx.arc((x - this.x) * this.zoom, (y - this.y) * this.zoom, radius * this.zoom, 0, 2 * Math.PI, true);
        if (fill) this.ctx.fill();
        else this.ctx.stroke();
    }
    
    drawCircleOnCanvas(x, y, radius, fill) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
        if (fill) this.ctx.fill();
        else this.ctx.stroke();
    }
    
    drawLine(x1, y1, x2, y2) {
        this.ctx.moveTo((x1 - this.x) * this.zoom, (y1 - this.y) * this.zoom);
        this.ctx.lineTo((x2 - this.x) * this.zoom, (y2 - this.y) * this.zoom);
        this.ctx.stroke();
    }
    
    drawLineOnCanvas(x1, y1, x2, y2) {
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }
}