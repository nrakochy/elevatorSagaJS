{
    init: function(elevators, floors) {
        var elevator1 = elevators[0];
        var elevator2 = elevators[1];

        var floorIsNotCurrentlyInQueue = function(floorNum, queue){
            return queue.indexOf(floorNum) == -1
        }

        var sortDestinationQueue = function(genericElevator){
            if(genericElevator.goingUpIndicator()){
               genericElevator.destinationQueue.sort();
                } else {
                    genericElevator.destinationQueue.sort().reverse();
                }
        }

        var addToDestinationQueue = function(floorNum, genericElevator){
            if (floorIsNotCurrentlyInQueue(floorNum, genericElevator.destinationQueue)){
            genericElevator.destinationQueue.push(floorNum);
            sortDestinationQueue(genericElevator);
            genericElevator.checkDestinationQueue();
            }
        }

        var availableUpElevator = function(genericElevator){
            genericElevator.goingUpIndicator() && (genericElevator.destinationQueue < floors.length)
        }

        var availableUpFloor = function(genericFloor, genericElevator){
            (genericFloor.floorNum() > genericElevator.currentFloor()) || (genericElevator.destinationQueue[0] < genericFloor.floorNum())
        }

        var availableDownElevator = function(genericElevator){
            genericElevator.goingDownIndicator() && (genericElevator.destinationQueue < floors.length)
        }

        var availableDownFloor = function(genericFloor, genericElevator){
            (genericFloor.floorNum() < genericElevator.currentFloor()) || (genericElevator.destinationQueue[0] > genericFloor.floorNum())
        }

        var addAvailableDownElevatorQueueListener = function(genericElevator, genericFloor){
            genericFloor.on("down_button_pressed", function() {
                if(availableDownFloor(genericFloor, genericElevator) && availableDownElevator(genericElevator)){
                    addToDestinationQueue(genericFloor.floorNum(), genericElevator)
                }
            });
        }

        var addAvailableUpElevatorQueueListener = function(genericElevator, genericFloor){
            genericFloor.on("up_button_pressed", function() {
                if(availableUpFloor(genericFloor,genericElevator) && availableUpElevator(genericElevator)){
                    addToDestinationQueue(genericFloor.floorNum(), genericElevator)
                }
            });
        }

        var addPressedButtonListener = function(genericElevator){
            genericElevator.on("floor_button_pressed", function(floorNum) {
                addToDestinationQueue(floorNum, genericElevator);
            });
        }

        var addIdleListener = function(genericElevator){
            genericElevator.on("idle", function(){
                if(genericElevator.currentFloor() <= (floors.length/2)){
                   genericElevator.goToFloor(floors.length)} else {
                    genericElevator.goToFloor(0)
                }
            })
        }

        floors.forEach(function(floor){
            elevators.forEach(function(elevator){
                addAvailableDownElevatorQueueListener(elevator, floor);
                addAvailableUpElevatorQueueListener(elevator, floor)
            });
        });

        elevators.forEach(function(elevator){ addPressedButtonListener(elevator)});
        elevators.forEach(function(elevator){ addIdleListener(elevator)});
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
