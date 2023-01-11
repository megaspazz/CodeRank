import { Component, Inject, QueryList, ViewChildren } from '@angular/core';
import { Observable, Subject, combineLatest, combineLatestWith, count, every, filter, from, groupBy, identity, of, last, map, mergeAll, mergeMap, reduce, takeLast, tap, toArray, windowCount, zip } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_BASE_HREF, Time } from '@angular/common';

import { ChartConfiguration, ChartOptions, ScatterDataPoint } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import 'chartjs-adapter-moment';
import { UrlSerializer } from '@angular/router';
import { createInjectableType } from '@angular/compiler';

// import * as sampleRequestMedium from './SampleRequestMedium.json';
// import * as sampleRequestLarge from './SampleRequestLarge.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'coderank';

  outputSubject = new Subject<string>();
  testStr = "lmao";

  log(x: any) {
    // console.log("yoooo...", this);
    // console.log("wtf " + this.testStr);
    this.outputSubject.next(x);
  }
 
  output$: Observable<string>;
  output: string;
  outputArray: string[] = [];

  answer$: Observable<number>;

  constructor(private http: HttpClient) {
    this.output$ = of("abc", "def");
    this.output = "blah";
    this.answer$ = of(0);
  }

  ngOnInit() {
    // this.output = "heck";

    // // Create simple observable that emits three values
    // const myObservable = of(1, 2, 3);

    // // Create observer object
    // const myObserver = {
    //   next: (x: number) => console.log('Observer got a next value: ' + x),
    //   error: (err: Error) => console.error('Observer got an error: ' + err),
    //   complete: () => console.log('Observer got a complete notification'),
    // };

    // // Execute with the observer object
    // myObservable.subscribe(myObserver);

    // // Logs:
    // // Observer got a next value: 1
    // // Observer got a next value: 2
    // // Observer got a next value: 3
    // // Observer got a complete notification
    // // console.log("HERE");



    let divOutputSubject = document.getElementById("divOutputSubject");
    // console.log(divOutputSubject);
    this.outputSubject.subscribe(x => {
      console.log(x);

      let divLine = document.createElement("div");
      // console.log(x, typeof x);
      divLine.textContent = typeof x === "object" ? JSON.stringify(x) : x;
      divOutputSubject?.appendChild(divLine);
    });

    // console.log("THERE");

    // this.log("piggers");

    // this.log("===== STARTING EXERCISES... =====");

    // this.exercise1();
    // this.exercise2();
    // this.exercise3();
    // this.exercise4();

    // this.log("===== EXERCISES COMPLETED!!! =====");

    // this.test1();
    // this.test2();

    this.updateCodeforces();
  }

  // Double an input observable.
  exercise1() {
    this.log("[exercise 1] doubling");

    const source = of(1, 2, 3);

    // let answer: Observable<number>;
    // this.answer$ = from(source.forEach(
    //   x => x * 2
    // ));


    // const answerSubscription = this.answer$.subscribe({
    //   next(x: number) {
    //     console.log(x);
    //   }
    // });

    // source.subscribe({
    //   next(x) {
    //     console.log(x * 2);
    //   }
    // }).subscribe({

    // });


    // this.answer$ = source.pipe(
    //   mergeMap(x => x * 2)
    // ).subscribe(x => {
    //   console.log(x);
    // });


    

    // const answer = new Observable((observer) => {
    //   source.subscribe({
    //     next(x) {
    //       observer.next(x * 2);
    //     }
    //   });
    //   return {
    //     unsubscribe() { }
    //   };
    // });

    // answer.subscribe(x => this.log(x));





    // source.forEach(x => console.log(x * 2));



    

    source.pipe(
      map(x => x * 2)
    ).subscribe(x => {
      this.log(x);
    });




    
    // this.answer$ = source.pipe(
    //   map(x => x * 2)
    // );
  }

  // Sum every two values in the observable.
  exercise2() {
    const source = of(1, 2, 3, 4, 5, 6, 7);

    this.log("[exercise 2] every other");

    class Window {
      sum: number;
      count: number;

      constructor(sum: number, count: number) {
        this.sum = sum;
        this.count = count;
      }
    };

    const answer = source.pipe(
      windowCount(2),
      map(win => win.pipe(
        reduce((acc, curr) => new Window(acc.sum + curr, acc.count + 1), new Window(0, 0)),
      )),
      mergeAll(),
      filter(x => x.count == 2),
      map(x => x.sum),
    );

    answer.subscribe(x => this.log(x));

    // answer.subscribe(this.log.bind(this));
    // answer.subscribe(this.log);

    // answer.pipe(
    //   tap(this.log),
    // ).subscribe(() => {});
    // let logFn = this.log;
    // answer.subscribe(logFn);
  }

  exercise3() {
    this.log("[exercise 3] splitting");
    const obs = of(1, 2, "there", "is", "a", 3, 4, "god", 5);
    
    let num_obs = obs.pipe(filter(inp => typeof(inp) === "number"));
    let str_obs = obs.pipe(filter(inp => typeof(inp) === "string"));

    // num_obs.subscribe(console.log);
    // str_obs.subscribe(console.log);
    
    // combineLatestWith(num_obs, str_obs).subscribe(data => {this.log(data[0] + "," + data[1])});

    const answer = zip(str_obs, num_obs).pipe(
      map(([str, num]) => str + " " + num),
    );
    
    answer.subscribe(x => this.log(x));
  }

  exercise4() {
    this.log("[exercise 4] count frequency");

    const obs = of(..."the dog ate the hot dog on the hot day".split(" "));

    // const answer = of(-1);

  //   let ans_obs = obs.pipe(
  //     groupBy(inpstring => inpstring),
  //    // return each item in group as array
  //    mergeMap(group => group.pipe(toArray()))
  //  );

  // let ans_obs = obs.pipe(
  //    groupBy(inpstring => inpstring),
  //   // return each item in group as array
  //   mergeMap(group => group.pipe(count()))
  // );

  // let ans_obs = obs.pipe(
  //    groupBy(inpstring => inpstring),
  //   // return each item in group as array
  //   mergeMap(group => [group.pipe(takeLast(1)), group.pipe(count())])
  // );

  // let ans_obs = obs.pipe(
  //   groupBy(inpstring => inpstring),
  //   // return each item in group as array
  //   mergeMap(group => zip(of(group.key), group.pipe(count())).pipe(
  //     map(([k, v]) => k + ":" + v),
  //   )),
  // );



  // const groups$ = obs.pipe(
  //   groupBy(x => x),
  // );
  // const counts$ = groups$.pipe(
  //   mergeMap(o$ => o$.pipe(
  //     reduce(acc => acc + 1, 0),
  //   )),
  // );
  // const ans_obs = zip(groups$, counts$).pipe(
  //   map(([group, count]) => group.key + ":" + count),
  // );

  let ans_obs = obs.pipe(
    groupBy(identity),
    mergeMap(group$ => zip(of(group$.key), group$.pipe(count())).pipe(
      map(([group, count]) => group + ":" + count),
    )),
  );

   ans_obs.subscribe(x => this.log(x));
  }

  exercise5() {
    // sort a mostly sorted stream, e.g. each number is at most 2 away from its sorted position?
  }

  exercise6() {
    // zip(A, B), but do zip(C, B) if A fails
  }

  exercise7() {
    // merge K sorted streams
  }

  exercise8() {
    // validate that two observables contain the same values, else throw an error
  }

  exerciseXXX() {
    // print 4 3 polyrhythm
  }

  exerciseYYY() {
    // clicking game (red = left click 1pt, blue = right click 2pt, green = middle click 3pt)
    // - how to model spawning?
    // - how to model clicking?
    // - how to model scoring?
  }

  test1() {
    // const arr = new Array(100000000);
    // for (let i = 0; i < arr.length; ++i) {
    //   arr[i] = i;
    // }

    // const source = of(...arr);
    
    // source.subscribe(console.log);

    const dataSource = new Observable(observer => {
      for (let i = 1; i <= 100; i++) {
        observer.next(i);  // Send the next number in the stream to the observers.
      }
    });
    
    dataSource.subscribe(x => console.log("test 1A: " + x));
    dataSource.subscribe(x => console.log("test 1B: " + x));
  }

  test2() {
    // const arr = new Array(100000000);
    // for (let i = 0; i < arr.length; ++i) {
    //   arr[i] = i;
    // }

    // const source = of(...arr);
    
    // source.subscribe(console.log);

    const dataSource = new Observable(observer => {
      // Will run through an array of numbers, emitting one value
      // per second until it gets to the end of the array.
      const end = 100;

      let timeoutId: any;
      function doInSequence(num: number) {
        timeoutId = setTimeout(() => {
          observer.next(num);

          ++num;
          if (num > end) {
            observer.complete();
          } else {
            doInSequence(num);
          }
        }, 0);
      }
      doInSequence(0);
    
      // Unsubscribe should clear the timeout to stop execution
      return {
        unsubscribe() {
          clearTimeout(timeoutId);
        }
      };
    });
    
    dataSource.subscribe(x => console.log("test 2A: " + x));
    dataSource.subscribe(x => console.log("test 2B: " + x));
  }

  standings$: Observable<TimeRank[]> = of([new TimeRank(123, 456)]);

  // @ViewChild(BaseChartDirective)
  // public chart: QueryList<BaseChartDirective>;

  @ViewChildren(BaseChartDirective)
  public lineChart?: QueryList<BaseChartDirective>;

  public codeforcesContestID: number | string | null = 1768;
  public codeforcesUserName: string = "megaspazz";

  public updateCodeforces() {
    const window = 60;

    const contestId = this.codeforcesContestID;
    const user = this.codeforcesUserName;

    // this.log(`UPDATING CODEFORCES! (${contestId}, ${user})`);
    // this.log()typeof contestId;
    
    if (typeof contestId !== "number") {
      alert("Contest ID must be a number!");
      return;
    }

    this.http.get<any>("./assets/cf-standings/" + contestId + ".json").subscribe({
      next: resp => {
        const userIdx = this.getUserIndex(resp.result.rows, user);
        // this.log("userIdx = " + userIdx);
    
        if (userIdx < 0) {
          this.standings$ = of();
          alert(`User not found: ${user}`);
          return;
        }
    
        const timeZoneOffsetMinutes = new Date().getTimezoneOffset();
        const timeZoneOffsetMillis = timeZoneOffsetMinutes * 60 * 1000;
    
        let ranks: TimeRank[] = [];
        let scatterData: ScatterDataPoint[] = [];
        let lineLabels: number[] = [];
        let lineData: number[] = [];
        for (let t = 0; t <= resp.result.contest.durationSeconds; t += window) {
          // ranks.push(new TimeRank(t, t * 10));
          const rankScore = this.getRankScore(resp.result.rows, userIdx, t);
          // if (rankScore.score != 0) {
            ranks.push(new TimeRank(t, rankScore.rank));
            scatterData.push({x: t, y: rankScore.rank});
            lineLabels.push(t * 1000 + timeZoneOffsetMillis);
            lineData.push(rankScore.rank);
          // }
          // this.log(t);
        }
    
        // TODO: is it more efficient to build data structures in memory and assign to binded members at the end?
        //       or is it OK simply to use the binded members directly, if it won't trigger any updates to UI until the end of the function?
        this.standings$ = of(ranks);
        this.scatterDatasets[0].data = scatterData;
        // this.lineDatasets.labels?.splice(0, this.lineDatasets.labels.length);
        // this.lineDatasets.labels?.push(...lineLabels);
        this.lineDatasets.labels = lineLabels;
        // this.lineDatasets.datasets[0].data?.splice(0, this.lineDatasets.datasets[0].data.length);
        // this.lineDatasets.datasets[0].data?.push(...lineData);
        this.lineDatasets.datasets[0].data = lineData;

        // console.log(this.lineDatasets.labels, this.lineDatasets.datasets[0].data);
        
        // console.log(this);
        // console.log(this.lineDatasets.datasets[0].data);

        // TODO: is there a way to manually update without calling this?
        //       for example, see the stackblitz posted on the question:
        //       https://stackoverflow.com/questions/63132818/creating-a-chart-using-ng2-charts-and-giving-it-the-labels-from-a-observable
        this.lineChart?.forEach(chart => chart.update());
      },
      error: err => {
        this.log(err);
        alert("Failed to find contest: " + contestId);
      },
    });
  }

  getUserIndex(users: any[], user: string) : number {
    for (let i = 0; i < users.length; ++i) {
      // console.log(i, users[i].party.members.map((x: any) => x.handle));
      if (users[i].party.members.map((x: any) => x.handle).includes(user)) {
        return i;
      }
    }
    return -1;
  }

  getRankScore(users: any[], userIdx: number, t: number) : RankScore {
    // console.log(users);
    const scores = users.map(x => {
      let problemScore = 0;
      for (const problem of x.problemResults) {
        if (problem.type === "FINAL" && problem.bestSubmissionTimeSeconds <= t) {
          problemScore += problem.points;
        }
      }
      // TODO: handle hacks properly.
      let hackScore = 100 * x.successfulHackCount - 50 * x.unsuccessfulHackCount;
      return problemScore + hackScore;
    });
    // this.log({t, scores});
    return new RankScore(1 + scores.filter(x => x > scores[userIdx]).length, scores[userIdx]);
  }

  public lineDatasets: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        fill: false,
        tension: 0.2,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)',
      },
    ],
  };

  public lineOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      xAxes: {
        type: 'time',
        time: {
          tooltipFormat:'H:mm:ss',
          displayFormats: {
            'second': 'H:mm:ss',
          },
          unit: 'second',
        },
        ticks: {
          source: "labels",
        },
      },
      yAxes: {
        reverse: true,
      },
    },
  };

  public lineLegend: boolean = false;

  public scatterDatasets: ChartConfiguration<'scatter'>['data']['datasets'] = [
    {
      data: [
        { x: 1, y: 1 },
        { x: 2, y: 3 },
        { x: 3, y: -2 },
        { x: 4, y: 4 },
        { x: 5, y: -3},
      ],
      label: 'Series A',
      pointRadius: 10,
    },
  ];

  public scatterOptions: ChartConfiguration<'scatter'>['options'] = {
    responsive: false,
  };

  public scatterLegend: boolean = false;
}

class TimeRank {
  time: number;
  rank: number;

  constructor(time: number, rank: number) {
    this.time = time;
    this.rank = rank;
  }
}

class RankScore {
  rank: number;
  score: number;

  constructor(rank: number, score: number) {
    this.rank = rank;
    this.score = score;
  }
}
