(function () {
    function processStage(stage, ontick, onwait, oncomplete) {
        let progress = 0;
        let tick = 0;
        let interval = setInterval(function () {
            let a = stage.first;
            let b = stage.wait;
            let c = stage.next;

            let mod = (tick - a) % (b + c);
            if (tick < a
                || (tick - a < b + c && tick - a >= b)
                || (tick - a >= b + c && mod >= b)
            ) {
                ++progress
                ontick(stage, tick, progress);
            } else {
                onwait(stage, tick, progress);
            }

            ++tick;
            if (stage.time == progress) {
                oncomplete(stage, tick, progress);
                clearInterval(interval);
            }
        }, 1000);
    }

    function drawApp(params) {
        let self = this;
        this.stages.forEach(stage => {
            let container = document.createElement('div');
            let label = document.createElement('p');
            label.innerHTML = stage.label;

            let progressContainer = document.createElement('div');
            progressContainer.className = 'progress-bar'
            let progress = document.createElement('div');
            progress.className = 'progress-indicator'
            progressContainer.appendChild(progress);

            container.appendChild(label);
            container.appendChild(progressContainer);
            this.element.appendChild(container);

            stage['progress'] = progress;

        });

        let buttonContainer = document.createElement('div');
        buttonContainer.className = "btn-container"
        let start = document.createElement('button');
        start.innerText = "Start";

        start.addEventListener('click', event => {
            this.run();
        });

        let stop = document.createElement('button');
        stop.innerText = "Reset";
        stop.addEventListener('click', event => {
            this.reset();
        });

        buttonContainer.appendChild(start);
        buttonContainer.appendChild(stop);

        this.element.appendChild(buttonContainer);
    }

    function Application(options) {
        this.stages = options.stages;
        this.status = 0;
        this.element = options.element;
        this.audio = options.audio;

        drawApp.call(this);
    }

    Application.prototype.run = function () {
        let stage = this.stages.shift();

        if (stage && status == 0) {
            this.status = 1;
            let audio = document.createElement('audio');
            processStage(
                stage,

                // when tick 
                (stage, tick, progress) => {
                    stage.progress.setAttribute("style", `width:${(progress / stage.time) * 100}%`);
                    audio.setAttribute('src', 'sounds/tick.wav');
                    audio.play();
                    // console.log(stage.progress)
                },

                (stage, tick, progress) => {       
                    audio.setAttribute('src', 'sounds/shake.wav');
                    audio.play();
                },

                (stage, tick, progress) =>  {
                    audio.setAttribute('src', 'sounds/complete.mp3');
                    audio.play();
                    this.status = 0;
                }
            );
        }
    };

    window.Redroom = Application;
})();


