/*

All the Mii file data format code here, taken from
mii-unsecure.ariankordi.net (with permission from Arian)

Please check the website source code for more information,
some comments might have been accidentally stripped by me for
readability

---Mii Clicker written by David Joaq---

If you are checking the source code, i hope its because
you want to do a similar thing, and not to try to hack into
the backend or do something mischevious :(

The server´s source code is closed source to avoid easy exploits, sowwy :(
You can technically consider Mii Clicker open source, im not minifying it or anything,
but im also too lazy to set up a GitHub page for it, and even if i did, that would mean
having to put the backend there as well, since this page is rendered by the server
UGGGGGHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH

If you do find an exploits or just want to ask me anything about
how this page was made, just DM me on Discord: dwyazzo90

The reason im not crediting myself in the actual page is because
im ashamed of admitting i made this page and letting everyone know,
i am not entirely proud of it, i know it couldve been way deeper and
more fun, i rushed its development and i originally meant to release it
right after the Tomo Life TLD announcement, but i misunderstimated how long
development for even the most basic of things can take.

I hope you liked Mii Clicker, the world needs more Mii stuff!

>>>>>Looking forward to TL: LTD !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

class AudioManager {
    constructor() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        // BGM
        this.bgmBuffer = null;
        this.bgmSource = null;
        this.bgmName = null;

        // SFX
        this.sfxBuffers = {};

        // Gain nodes
        this.bgmGain = this.audioCtx.createGain();
        this.bgmGain.connect(this.audioCtx.destination);

        this.sfxGain = this.audioCtx.createGain();
        this.sfxGain.connect(this.audioCtx.destination);

        this.bgmGain.gain.value = 0.1;
        this.sfxGain.gain.value = 2;

        // Preloaded tracks
        this.bgmTracks = {};
    }

    // Load track into memory
    async loadTrack(name, url, isSfx = false) {
        const resp = await fetch(url);
        const arrayBuffer = await resp.arrayBuffer();
        const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);

        if (isSfx) {
            this.sfxBuffers[name] = audioBuffer;
        } else {
            this.bgmTracks[name] = audioBuffer;
        }
    }

    // Play BGM with optional loopStart & loopEnd (seconds)
    playBgm(name, gain = 0.1, loop = true, loopStart = 0, loopEnd = null) {
        if (!this.bgmTracks[name]) {
            console.warn("BGM not loaded:", name);
            return;
        }

        // Already playing this track? Do nothing
        if (this.bgmName === name && this.bgmSource) return;

        // Stop current BGM
        if (this.bgmSource) {
            this.bgmSource.stop();
            this.bgmSource.disconnect();
        }

        const buffer = this.bgmTracks[name];
        const source = this.audioCtx.createBufferSource();
        source.buffer = buffer;

        this.bgmGain.gain.value = gain;
        source.loop = loop;

        // Loop logic
        if (loopEnd !== null && loopEnd > loopStart) {
            source.loopStart = loopStart;
            source.loopEnd = Math.min(loopEnd, buffer.duration);
            source.start(0, loopStart);
        } else {
            // Full track loop
            source.loopStart = 0;
            source.loopEnd = buffer.duration;
            source.start(0);
        }

        source.connect(this.bgmGain);

        this.bgmSource = source;
        this.bgmName = name;
    }

    // Stop BGM
    stopBgm() {
        if (this.bgmSource) {
            this.bgmSource.stop();
            this.bgmSource.disconnect();
            this.bgmSource = null;
            this.bgmName = null;
        }
    }

    // Play SFX
    playSfx(name) {
        const buffer = this.sfxBuffers[name];
        if (!buffer) return console.warn("SFX not loaded:", name);

        const source = this.audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.sfxGain);
        source.start();
    }
}


$(window).on("load", async function () {
    var titlechr1 = new Image();
    var titlechr2 = new Image();
    var titlechr3 = new Image();
    titlechr1.src = "../img/title_chr1.png";
    titlechr2.src = "../img/title_chr2.png";
    titlechr3.src = "../img/title_chr3.png";

    var audioMgr = new AudioManager();

    var titleScreenClicky = 0;
    var titleScreenAlertIgnored = 0;
    var charlottePissedOff = false;

    var titleIsDown = false;

    $(".title-mii").on("pointerover pointermove", function () {
        if (titleIsDown) return;
        $(".title-mii").attr("src", titlechr2.src);
    });

    $(".title-mii").on("pointerout pointercancel", function () {
        $(".title-mii").attr("src", titlechr1.src);
    });

    $(".title-mii").on("pointerdown", function () {
        titleScreenClicky++;
        if (titleScreenClicky >= 10) {
            titleScreenAlertIgnored++;
            if (titleScreenAlertIgnored >= 5) {
                alert("I wasnt kidding, im actually pissed off now.");
                charlottePissedOff = true;
                $(".title-mii").off("pointerdown pointerover pointerup pointermove pointerout pointercancel")
            } else {
                alert("Please press Start to play! This is not the actual game!");
            }
            titleScreenClicky = 0;
            $(".title-mii").attr("src", titlechr1.src).css("top", "0px");
            return;
        }
        titleIsDown = true;
        $(".title-mii").attr("src", titlechr3.src).css("top", "-25px");
    });

    $(".title-mii").on("pointerup pointercancel", function () {
        $(".title-mii").attr("src", titlechr1.src).css("top", "0px");
        titleIsDown = false;
    });

    $(".title-menu .view-leaderboard").on("click", async function () {
        audioMgr.playSfx("select");
        if (!getCookie("bsky_session")) {
            $(".bsky-why-fortherecord").show();
            $(".leaderboard-screen .followings").addClass("disabled");
            $(".leaderboard-screen .myself").addClass("disabled");
        } else {
            $(".bsky-why-fortherecord").hide();
            $(".leaderboard-screen .followings").removeClass("disabled");
            $(".leaderboard-screen .myself").removeClass("disabled");
        }
        updateLeaderboardByType(1);
        $(".title-screen").removeClass("active-screen");
        $(".leaderboard-screen").addClass("active-screen");
        window.scrollTo(0, 0);
    });

    $(".title-menu .start").on("click", async function () {
        audioMgr.playSfx("select");
        await trySavedMiiPreview()
        $(".title-screen").removeClass("active-screen")
        $(".select-mii").addClass("active-screen")
        window.scrollTo(0, 0);
    });

    $(".mii-data-screen").on("click", async function () {
        audioMgr.playSfx("select");
        $(".select-mii").removeClass("active-screen")
        $(".select-mii-file-text").addClass("active-screen")
        window.scrollTo(0, 0);
    });

    $(".mii-nnid-screen").on("click", async function () {
        audioMgr.playSfx("select");
        $(".select-mii").removeClass("active-screen")
        $(".select-mii-nnid").addClass("active-screen")
        window.scrollTo(0, 0);
    });

    $(".mii-return-title").on("click", function () {
        audioMgr.playSfx("back");
        $(".select-mii").removeClass("active-screen")
        $(".title-screen").addClass("active-screen")
        window.scrollTo(0, 0);
    });

    function clearBlueskySession() {
        document.cookie = "bsky_session=; Max-Age=0; path=/; SameSite=Lax;";
        document.cookie = "bsky_auth=; Max-Age=0; path=/; SameSite=Lax;";
        location.replace(location.href);
    }

    $(".logout-bsky").on("click", function () {
        audioMgr.playSfx("select");
        clearBlueskySession();
    });

    $(".return-mii-data-uploading").on("click", function () {
        audioMgr.playSfx("back");
        $(".select-mii-file-text").removeClass("active-screen")
        $(".select-mii").addClass("active-screen")
        window.scrollTo(0, 0);
    });

    function getFeelingQueryById(id) {
        var f;
        switch (id) {
            case 0:
                f = "normal";
                break;
            case 1:
                f = "smile_open_mouth";
                break;
            case 2:
                f = "like_wink_left";
                break;
            case 3:
                f = "surprise_open_mouth";
                break;
            case 4:
                f = "frustrated";
                break;
            case 5:
                f = "sorrow";
                break;
            default:
                break;
        }
        return f;
    }

    function updateLeaderboardByType(type) {
        showLoadingIcon(true);
        $(".leaderboard-screen").css("pointer-events", "none");
        $(".leaderboard-screen .score-navi a").removeClass("selected");
        $(".leaderboard-screen .user-container").empty();
        $(".leaderboard-screen .all-time-text").hide();
        $(".leaderboard-screen .today-text").hide();
        $(".leaderboard-screen .followings-text").hide();
        $(".leaderboard-screen .myself-text").hide();
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        var url = "/records?type=";
        switch (type) {
            case 1:
                $(".leaderboard-screen .score-navi .alltime").addClass("selected");
                url += "record_alltime";
                $(".leaderboard-screen .all-time-text").show();
                break;
            case 2:
                $(".leaderboard-screen .score-navi .today").addClass("selected");
                $(".leaderboard-screen .today-text").show();
                url += "record_today&tzOffset=" + encodeURIComponent(new Date().getTimezoneOffset());
                break;
            case 3:
                $(".leaderboard-screen .followings-text").show();
                $(".leaderboard-screen .score-navi .followings").addClass("selected");
                url += "record_followings";
                break;
            case 4:
                $(".leaderboard-screen .myself-text").show();
                $(".leaderboard-screen .score-navi .myself").addClass("selected");
                url += "record_myself";
                break;
            default:
                break;
        }
        xhr.open("GET", url);
        xhr.send();

        var template = $("#record-screen-mii-template").html();
        xhr.onload = function () {
            showLoadingIcon(false);
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText).records;
                if (!data || !data.length) {
                    $(".leaderboard-screen .user-container").html("<p>There are no records available</p>");
                    $(".leaderboard-screen").css("pointer-events", "auto");
                    return;
                }
                data.forEach(record => {
                    var el = $(template);
                    var face = getRenderUrl(record.mii_data, "face", "256", null, getFeelingQueryById(record.feeling_id));
                    el.attr("data-mii-url", face);
                    el.attr("data-mii-name", record.mii_name);
                    el.attr("data-mii-record-count", record.score);
                    el.attr("data-mii-record-id", record.record_id);
                    el.attr("data-has-post", record.post ? "1" : "");
                    el.find("img").attr("src", face)
                    // Convert to Date
                    const date = new Date(record.create_time);

                    // Format using browser locale and timezone
                    const formatted = date.toLocaleString();

                    el.attr("data-mii-record-date", formatted);
                    el.find(".name").text(record.mii_name);
                    el.find(".date").text(formatted);
                    el.find(".score>span").text(record.score);
                    if (record.post) {
                        el.attr("data-post-is-spoiler", record.post.record.text.includes("#MCSpoiler"));
                        el.attr("data-post-bsky-avatar", record.post.author.avatar)
                        el.attr("data-post-bsky-displayName", record.post.author.displayName)
                        el.attr("data-post-bsky-handle", record.post.author.handle)
                        el.attr("data-post-likes", record.post.record.likeCount)
                        el.attr("data-post-replies", record.post.record.replyCount)
                        el.attr("data-post-content", record.post.record.text)

                        if (record.post.record.text.includes("#MCSpoiler")) {
                            el.find(".post-preview").addClass("spoiler");
                            el.find(".post-preview p").html("This post contains spoilers.<br>Select to view post content.");
                        } else {
                            el.find(".post-preview p").text(record.post.record.text)
                        }
                        el.attr("data-post-bsky-author-url", "https://bsky.app/profile/" + record.post.author.handle);
                        const match = record.post.uri.match(/app\.bsky\.feed\.post\/([^\/]+)/);
                        el.attr("data-post-bsky-url", "https://bsky.app/profile/" + record.post.author.handle + "/post/" + match[1])
                        el.find(".has-bsky-post").addClass("has")
                    }
                    $(".leaderboard-screen .user-container").append(el);
                });

                $(".leaderboard-screen .user-container>a").on("click", function () {
                    $(".leaderboard-screen .post-preview").hide();
                    audioMgr.playSfx("select");
                    createPostViewModal($(this))
                })
            } else {
                try {
                    var a = JSON.parse(xhr.responseText)
                    if (a && a.error) {
                        switch (a.error) {
                            case "NOT_LOGGED_IN":
                            case "NO_AUTH_REFRESH_COOKIE":
                            case "BSKY_SESSION_MISSING":
                                alert("Your Bluesky session has expired.\n\nThe page will now reload.");
                                clearBlueskySession();
                                return;

                            default:
                                break;
                        }
                    }
                } catch (e) {
                }
                switch (type) {
                    case 1:
                    case 2:
                        alert("Failed to download leaderboard data.")
                        break;
                    case 3:
                    case 4:
                        alert("Failed to download Bluesky data/leaderboard data.\n\nYou might need to log out and log back in to Bluesky.")
                        break;
                    default:
                        break;
                }
            }
            $(".leaderboard-screen").css("pointer-events", "auto");
        }
    }


    function createPostViewModal(postEl) {
        $(".leaderboard-screen").css("pointer-events", "none")
        var h = $("#view-mii-score-details").html();
        var div = $(h);

        div.find(".mii-meta img").attr("src", postEl.attr("data-mii-url"));
        div.find(".record>span").text(postEl.attr("data-mii-record-count"));
        div.find(".mii-meta p").text(postEl.attr("data-mii-name"));
        div.find(".date").text(postEl.attr("data-mii-record-date"));

        if (postEl.attr("data-has-post") === "1") {
            div.find(".bsky-meta img").attr("src", postEl.attr("data-post-bsky-avatar"));
            div.find(".bsky-meta .screen_name").text(postEl.attr("data-post-bsky-displayName"));
            div.find(".bsky-meta .username").text("@" + postEl.attr("data-post-bsky-handle"));

            div.find(".post-content").text(postEl.attr("data-post-content"));

            div.find(".bsky-meta").attr("href", postEl.attr("data-post-bsky-author-url"))
            div.find(".bsky-meta").on("click", function () {
                audioMgr.playSfx("select");
            })
            div.find(".view-post-bsky").attr("href", postEl.attr("data-post-bsky-url"))
            div.find(".view-post-bsky").on("click", function () {
                audioMgr.playSfx("select");
            })
        } else {
            div.find(".bsky-meta").hide();
            div.find(".post-content").hide();
            div.find(".view-post-bsky").hide();
        }

        div.find(".close-record-view").on("click", function () {
            audioMgr.playSfx("back");
            div.remove();
            $(".leaderboard-screen").css("pointer-events", "auto")
        })

        $("body").append(div);
    }

    $(".return-from-records").on("click", function () {
        audioMgr.playSfx("back");
        $(".leaderboard-screen").removeClass("active-screen")
        $(".title-screen").addClass("active-screen")
        window.scrollTo(0, 0);
    })

    $(".leaderboard-screen .score-navi a").on("click", function () {
        if ($(this).hasClass("disabled") || $(this).hasClass("selected")) return;
        if ($(this).hasClass("today")) {
            updateLeaderboardByType(2);
        } else if ($(this).hasClass("alltime")) {
            updateLeaderboardByType(1);
        } else if ($(this).hasClass("followings")) {
            updateLeaderboardByType(3);
        } else if ($(this).hasClass("myself")) {
            updateLeaderboardByType(4);
        }
        audioMgr.playSfx("feeling");
    })

    $(".return-nnid-uploading").on("click", function () {
        audioMgr.playSfx("back");
        $(".select-mii-nnid").removeClass("active-screen")
        $(".select-mii").addClass("active-screen")
        window.scrollTo(0, 0);
    });


    $(".after-gameplay-return").on("click", function () {
        audioMgr.playSfx("select");
        $(".end-screen").removeClass("active-screen")
        $(".title-screen").addClass("active-screen")
        window.scrollTo(0, 0);
    });

    var miiData = {
        type: null,
        data: null
    };

    $("#mii-input").on("change", async function (e) {
        const input = this;
        if (!input.files || !input.files.length) return;

        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = async function (e) {
            $("#mii-text-input").val("");
            miiData.data = e.target.result.split(',')[1];
            await tryRenderMiiDataUpload();
        };

        reader.onerror = function () {
            console.error("Failed to read file");
        };

        reader.readAsDataURL(file);
    });

    let inputTimeout = null;
    let inputTimeoutNNID = null;
    let inputTimeoutPNID = null;

    $("#mii-text-input").on("input", function () {
        const value = this.value;

        clearTimeout(inputTimeout);

        inputTimeout = setTimeout(async function () {
            $("#mii-input").val("");
            miiData.data = value;
            await tryRenderMiiDataUpload();
        }, 100);
    });

    const miiDataApi = "https://mii-unsecure.ariankordi.net/mii_data/"

    async function requestMiiDataByID(type, id) {
        showLoadingIcon(true);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", miiDataApi + id + "?api_id=" + (type === "PN" ? "1" : "0"));
        xhr.send();
        xhr.onload = async function () {
            showLoadingIcon(false);
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                miiData.data = data.data;
                await tryRenderMiiDataNNIDUpload();
            } else {
                if (type === "PN") {
                    alert("Please enter a valid Pretendo Network ID.")
                } else {
                    alert("Either this Nintendo Network ID does not exist or the Mii data for it is not available.")
                }
            }
        }
    }

    $("#mii-nnid-input-form").on("input", function () {
        const value = this.value;

        if (!value || !value.length) {
            return;
        }

        clearTimeout(inputTimeoutNNID);

        inputTimeoutNNID = setTimeout(async function () {
            $("#mii-pnid-input-form").val("");
            await requestMiiDataByID("NN", value)
        }, 800);
    });

    $("#mii-pnid-input-form").on("input", function () {
        const value = this.value;

        if (!value || !value.length) {
            return;
        }

        clearTimeout(inputTimeoutPNID);

        inputTimeoutPNID = setTimeout(async function () {
            $("#mii-nnid-input-form").val("");
            await requestMiiDataByID("PN", value)
        }, 800);
    });


    $(".select-mii .mii-name").on("input", function () {
        localStorage.setItem("custom_mii_name", $(this).val());
    })

    $(".mii-start-game").on("click", async function () {
        audioMgr.playSfx("select");
        if ($(this).hasClass("disabled")) return;
        if (!$(".select-mii .mii-name").val().length > 0) {
            return alert("Please give a name to the Mii. Mii Studio data does not transfer over names.")
        }
        await initializeNewClickingSession();
    });

    async function createPostModal() {
        return new Promise((resolve) => {
            var html = $("#post-screen-trigger-bsky").html();
            var container = $(html);

            postAppMiiIconNormal.src = getRenderUrl(miiData.data, "face", 196, null, null)
            postAppMiiIconHappy.src = getRenderUrl(miiData.data, "face", 196, null, "smile_open_mouth")
            postAppMiiIconLike.src = getRenderUrl(miiData.data, "face", 196, null, "like_wink_left")
            postAppMiiIconSurprised.src = getRenderUrl(miiData.data, "face", 196, null, "surprise_open_mouth")
            postAppMiiIconDisgust.src = getRenderUrl(miiData.data, "face", 196, null, "frustrated")
            postAppMiiIconSorrow.src = getRenderUrl(miiData.data, "face", 196, null, "sorrow")

            container.find(".icon").attr("src", postAppMiiIconNormal.src)
            // Feeling buttons
            container.find(".buttons li").on("click", function () {
                var feelingNum = $(this).find("input").val();
                switch (feelingNum) {
                    case "0":
                        container.find(".icon").attr("src", postAppMiiIconNormal.src)
                        break;
                    case "1":
                        container.find(".icon").attr("src", postAppMiiIconHappy.src)
                        break;
                    case "2":
                        container.find(".icon").attr("src", postAppMiiIconLike.src)
                        break;
                    case "3":
                        container.find(".icon").attr("src", postAppMiiIconSurprised.src)
                        break;

                    case "4":
                        container.find(".icon").attr("src", postAppMiiIconDisgust.src)
                        break;
                    case "5":
                        container.find(".icon").attr("src", postAppMiiIconSorrow.src)
                        break;

                    default:
                        container.find(".icon").attr("src", postAppMiiIconNormal.src)
                        break;
                }
                audioMgr.playSfx("feeling");
            });

            // Cancel
            container.find(".panel-button.cancel").on("click", function () {
                if ($(this).hasClass("disabled")) return;
                audioMgr.playSfx("back");
                close(false);
            });

            // Confirm / Send
            container.find(".panel-button.confirm").on("click", function () {
                if ($(this).hasClass("disabled")) return;
                container.find(".bottom-buttons a").addClass("disabled")
                audioMgr.playSfx("select");

                var text = container.find("textarea").val();
                if (!text) {
                    alert("Please enter a message.")
                    container.find(".bottom-buttons a").removeClass("disabled")
                    return;
                }

                var feelingId = container.find(".buttons li input:checked").val();
                var isSpoiler = container
                    .find(".spoiler-button input[type=checkbox]")
                    .prop("checked");

                sendRecordWithBlueskyPost(text, feelingId, isSpoiler, function (isSuccess) {
                    if (isSuccess) {
                        alert("Your record and message has been uploaded with success!");
                        close(true);
                    }
                    container.find(".bottom-buttons a").removeClass("disabled")
                })
            });

            // Spoiler checkbox
            container.on("change", ".spoiler-button input[type=checkbox]", function () {
                audioMgr.playSfx(this.checked ? "check" : "uncheck");
            });

            function close(result) {
                container.find(".panel").addClass("down");

                setTimeout(() => {
                    container.remove();
                    resolve(result);
                }, 1000); // match animation duration
            }

            $("body").append(container);
        });
    }

    $(".post-record").on("click", function () {
        var b = $(this)
        var c = $(".post-bsky-record");

        var canBsky = getCookie("bsky_session")
        if (b.hasClass("disabled") || canBsky && c.hasClass("disabled")) return;
        audioMgr.playSfx("select");
        b.addClass("disabled");
        c.addClass("disabled");
        sendRecordWithoutBlueskyPost(function (isSuccess) {
            if (isSuccess) {
                alert("Your record has been uploaded with success!");
                $(".end-screen").removeClass("active-screen")
                var count = parseInt($(".title-screen .logo p>span").text(), 10);
                $(".title-screen .logo p>span").text(count + 1);
                $(".title-screen").addClass("active-screen")
                window.scrollTo(0, 0);
            }
            b.removeClass("disabled");
            if (canBsky) {
                c.removeClass("disabled");
            }
        });
    });

    $(".post-bsky-record").on("click", function () {
        var b = $(this)
        var c = $(".post-record");

        if (b.hasClass("disabled") || c.hasClass("disabled")) return;
        $(".end-screen").css("pointer-events", "none")
        audioMgr.playSfx("select");
        audioMgr.stopBgm();
        b.addClass("disabled");
        c.addClass("disabled");
        setTimeout(async function () {
            audioMgr.playBgm("bgm_olv", 1, false);
            const result = await createPostModal();
            audioMgr.playBgm("bgm_title", 0.1, true);
            if (result) {
                //this means the record was sent.
                setTimeout(function () {
                    b.removeClass("disabled");
                    c.removeClass("disabled");
                    $(".end-screen").css("pointer-events", "auto")
                    $(".end-screen").removeClass("active-screen")
                    var count = parseInt($(".title-screen .logo p>span").text(), 10);
                    $(".title-screen .logo p>span").text(count + 1);
                    $(".title-screen").addClass("active-screen")
                    window.scrollTo(0, 0);
                }, 500)
            } else {
                $(".end-screen").css("pointer-events", "auto")
                b.removeClass("disabled");
                c.removeClass("disabled");
            }
        }, 1000);
    });


    $(".title-menu .link-bsky").on("click", function () {
        audioMgr.playSfx("select");
        $(".title-screen").removeClass("active-screen")
        $(".bsky-link-screen").addClass("active-screen")
        window.scrollTo(0, 0);
    });

    $(".login-bsky-return").on("click", function () {
        audioMgr.playSfx("back");
        $(".bsky-link-screen").removeClass("active-screen")
        $(".title-screen").addClass("active-screen")
        window.scrollTo(0, 0);
    });

    $(".form-login-bsky .login-bsky-confirm").on("click", function () {
        var l = $(this);
        if (l.hasClass("disabled")) return;
        showLoadingIcon(true);
        audioMgr.playSfx("select");
        var u = $(".form-login-bsky input[name='user']").val();
        var p = $(".form-login-bsky input[name='pswd']").val();
        if (!u.length || !p.length) {
            return alert("Please fill all of the fields.")
        }
        l.addClass("disabled");

        var form = new FormData();
        form.append("username", u);
        form.append("password", p);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/bsky/auth", true);
        xhr.withCredentials = true;

        xhr.onload = function () {
            showLoadingIcon(false);
            if (xhr.status === 200) {
                let info = JSON.parse(getCookie("bsky_session"));
                $(".bsky-loggedin p>span").text("@" + info.data.handle);
                $(".bsky-loggedin").show();
                $(".title-menu .link-bsky").hide();
                $(".bsky-why").hide();

                $(".bsky-link-screen").removeClass("active-screen");
                $(".title-screen").addClass("active-screen");
                window.scrollTo(0, 0);
            } else {
                alert("Failed to log in to Bluesky, please input valid data.")
            }
            l.removeClass("disabled");
        };

        xhr.send(form);
    });


    const supportedTypes = [
        // don't think anyone actually uses this
        {
            name: 'FFLiMiiDataCore',
            sizes: [72],
            offsetName: 0x1A,
        },
        { // "3dsmii"
            name: 'FFLiMiiDataOfficial',
            sizes: [92],
            offsetName: 0x1A,
        },
        {
            name: 'FFLStoreData',
            sizes: [96],
            offsetCRC16: 94,
            offsetName: 0x1A,
        },
        {
            name: 'FFLStoreData',
            sizes: [104,  // 104 = 96 + nfpstoredataextention length
                106, 108, // mii-creator custom format
                336 // plus tomodachi life qr code extension
            ],
            offsetCRC16: 94,
            offsetName: 0x1A,
            specialCaseConvertTo: true
        },
        {
            name: 'RFLCharData',
            sizes: [74],
            offsetName: 0x2,
            isNameU16BE: true
        },
        {
            name: 'RFLStoreData',
            sizes: [76],
            offsetCRC16: 74,
            offsetName: 0x2,
            isNameU16BE: true
        },
        {
            name: 'nn::mii::CharInfo',
            sizes: [88],
            offsetName: 0x10,
        },
        {
            name: 'nn::mii::CoreData',
            sizes: [48, 68],
            offsetName: 0x1C,
        },
        // TODO: DON'T KNOW THE CRC, DON'T HAVE SAMPLES EITHER
        /*{
          name: 'nn::mii::StoreData',
          sizes: [68],
          offsetName: 0x1C,
        },*/
        /*
              <!-- switch mii store data types:
              nn::mii::CoreData - 48 bytes
                * size from method nn::mii::detail::CoreDataRaw::SetDefault
                  - contains memset for 0x30 = size is 0x30/48
              nn::mii::StoreData - 68 bytes, i think
                * size from method nn::mii::detail::StoreDataRaw::UpdateDeviceCrc -> nn::mii::detail::CalculateAndSetCrc16
                  - sets total size to 0x44 = size is 0x44/68
              -->
        */
        {
            name: 'Mii Studio Data',
            sizes: [46, 47], // ignoring the encoded format for now
        },
    ];

    const findSupportedTypeBySize = size => supportedTypes.find(type => type.sizes.includes(size));

    const stripSpaces = str => str.replace(/\s+/g, '');
    const hexToUint8Array = hex => new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const base64ToUint8Array = base64 => {
        // Replace URL-safe Base64 characters
        const normalizedBase64 = base64.replace(/-/g, '+').replace(/_/g, '/');
        // Add padding if necessary
        const paddedBase64 = normalizedBase64.padEnd(normalizedBase64.length + (4 - (normalizedBase64.length % 4)) % 4, '=');
        return Uint8Array.from(atob(paddedBase64), c => c.charCodeAt(0));
    };

    const uint8ArrayToBase64 = data => btoa(String.fromCharCode.apply(null, data));

    const parseHexOrB64TextStringToUint8Array = text => {
        let inputData;
        console.log(text)
        // decode it to a uint8array whether it's hex or base64
        const textData = stripSpaces(text);
        // check if it's base 16 exclusively, otherwise assume base64
        if (/^[0-9a-fA-F]+$/.test(textData))
            inputData = hexToUint8Array(textData);
        else
            inputData = base64ToUint8Array(textData);

        return inputData;
    };

    function checkSupportedTypeBySize(data, type, checkCRC16) {

        if (!type) {
            return false;
        }

        if (type.offsetCRC16) {
            const dataCrc16 = data.slice(type.offsetCRC16, type.offsetCRC16 + 2);
            const dataCrc16u16 = (dataCrc16[0] << 8) | dataCrc16[1];
            const expectedCrc16 = crc16(data.slice(0, type.offsetCRC16));

            if (expectedCrc16 !== dataCrc16u16) {
                if (checkCRC16) {
                    return false;
                }
                else
                    // returns a third type
                    return 2;
            }
        }

        return true;
    }

    function extractUTF16Text(data, startOffset, isBigEndian, nameLength) {
        // Default to 10 characters (20 bytes) if nameLength is not provided
        const length = nameLength !== undefined ? nameLength * 2 : 20;
        let endPosition = startOffset;

        // Determine the byte order based on the isBigEndian flag
        // NOTE: TextDecoder only works on newish browsers
        // despite the rest of this script using pre-ES6 syntax
        // TODO: TEST ON OLDER BROWSERS!!!!!!!!!!
        const decoder = new TextDecoder(isBigEndian ? 'utf-16be' : 'utf-16le');

        // Find the position of the null terminator (0x00 0x00)
        while (endPosition < startOffset + length) {
            if (data[endPosition] === 0x00 && data[endPosition + 1] === 0x00) {
                break;
            }
            endPosition += 2; // Move in 2-byte increments (UTF-16)
        }

        // Extract and decode the name bytes
        const nameBytes = data.slice(startOffset, endPosition);
        return decoder.decode(nameBytes);
    }

    function getNameFromSupportedType(data, type) {
        if (!type)
            return false;

        if (!type.offsetName)
            return null;
        // specifically return null for no offset name
        // so that the next function uses the type name instead

        // Use the new extractUTF16Text function to get the name string
        const nameString = extractUTF16Text(data, type.offsetName, type.isNameU16BE, type.nameLength);

        return nameString;
    }

    function getMiiNameByType(data, type, crc16NotPassed) {
        if (!type)
            return false;

        const nameString = getNameFromSupportedType(data, type);
        if (crc16NotPassed) {
        }
        else if (type.offsetCRC16) {
        } else {
        }
        return nameString;
    }

    function crc16(data) {
        let crc = 0;
        let msb = crc >> 8;
        let lsb = crc & 0xFF;

        for (let i = 0; i < data.length; i++) {
            let c = data[i];
            let x = c ^ msb;
            x ^= (x >> 4);
            msb = (lsb ^ (x >> 3) ^ (x << 4)) & 0xFF;
            lsb = (x ^ (x << 5)) & 0xFF;
        }

        crc = (msb << 8) + lsb;
        return crc;
    }

    const miiApi = "https://mii-unsecure.ariankordi.net/miis/image.png";

    function getRenderUrl(data, type, width, drawStageMode, expression) {
        var query = "?data=" + encodeURIComponent(data) + "&resourceType=very_high";

        if (type) {
            query += "&type=" + type
        }
        if (width) {
            query += "&width=" + width
        }
        if (drawStageMode) {
            query += "&drawStageMode=" + drawStageMode
        }
        if (expression) {
            query += "&expression=" + expression
        }
        return miiApi + query;
    }

    let globalVerifyCRC16 = true;

    var gameTimer = {
        duration: 5,
        remaining: 5,
        intervalId: null,
        callback: function () {
            alert("Times Up !!!!");
            afterGameSessionEnds();
        },

        start: function () {
            var self = this;
            clearInterval(self.intervalId); // clear if running
            self.remaining = self.duration;
            $(".click-tleft").text(self.remaining);

            self.intervalId = setInterval(function () {
                self.remaining--;
                $(".click-tleft").text(self.remaining);

                if (self.remaining <= 0) {
                    clearInterval(self.intervalId);
                    self.callback();
                }
            }, 1000);
        },

        reset: function () {
            this.start();
        },

        setDuration: function (seconds) {
            this.duration = seconds;
            this.start();
        },

        stop: function () {
            clearInterval(this.intervalId);
        }
    };

    async function tryRenderMiiDataUpload() {
        try {
            const data = parseHexOrB64TextStringToUint8Array(miiData.data);
            const type = findSupportedTypeBySize(data.length);
            const checkResult = checkSupportedTypeBySize(data, type, globalVerifyCRC16);

            if (!checkResult) {
                $(".mii-start-game").addClass("disabled");
                return alert("This Mii format data is not supported.");
            }

            localStorage.setItem("mii_default", miiData.data);

            preloadMiiRender();
            // extract name and show loaded text
            const mii_name = getMiiNameByType(data, type, (checkResult === 2));
            $(".select-mii-file-text .mii-name").val(mii_name);
            $(".select-mii-file-text .mii-image").attr("src", frontMiiIconNormal.src)

            if (!mii_name) {
                localStorage.setItem("custom_mii_name", "")
            } else {
                localStorage.setItem("custom_mii_name", mii_name)
            }

            $(".select-mii .mii-name").val(mii_name);
            $(".select-mii .mii-image").attr("src", frontMiiIconNormal.src)

            //ONLY then it works
            $(".mii-start-game").removeClass("disabled");
        } catch (error) {
            $(".mii-start-game").addClass("disabled");
            console.log("Error:", error);
            alert("Please upload valid Mii data/files!");
        }
    }

    async function tryRenderMiiDataNNIDUpload() {
        try {
            const data = parseHexOrB64TextStringToUint8Array(miiData.data);
            const type = findSupportedTypeBySize(data.length);
            const checkResult = checkSupportedTypeBySize(data, type, globalVerifyCRC16);

            if (!checkResult) {
                $(".mii-start-game").addClass("disabled");
                return alert("This Mii format data is not supported.");
            }

            localStorage.setItem("mii_default", miiData.data);

            preloadMiiRender();
            // extract name and show loaded text
            const mii_name = getMiiNameByType(data, type, (checkResult === 2));
            $(".select-mii-nnid .mii-name").val(mii_name);
            $(".select-mii-nnid .mii-image").attr("src", frontMiiIconNormal.src)

            if (!mii_name) {
                localStorage.setItem("custom_mii_name", "")
            } else {
                localStorage.setItem("custom_mii_name", mii_name)
            }

            $(".select-mii .mii-name").val(mii_name);
            $(".select-mii .mii-image").attr("src", frontMiiIconNormal.src)

            //ONLY then it works
            $(".mii-start-game").removeClass("disabled");
        } catch (error) {
            $(".mii-start-game").addClass("disabled");
            console.log("Error:", error);
            alert("Please upload valid Mii data/files!");
        }
    }

    async function tryRenderMiiSelectPreview() {
        try {
            const data = parseHexOrB64TextStringToUint8Array(miiData.data);
            const type = findSupportedTypeBySize(data.length);
            const checkResult = checkSupportedTypeBySize(data, type, globalVerifyCRC16);

            if (!checkResult) {
                $(".mii-start-game").addClass("disabled");
                return alert("This Mii format data is not supported.");
            }

            localStorage.setItem("mii_default", miiData.data);

            preloadMiiRender();
            // extract name and show loaded text
            const mii_name = getMiiNameByType(data, type, (checkResult === 2));

            var saved_name = localStorage.getItem("custom_mii_name");
            if (saved_name) {
                $(".select-mii .mii-name").val(localStorage.getItem("custom_mii_name"));
            } else {
                $(".select-mii .mii-name").val(mii_name);
            }

            $(".select-mii .mii-image").attr("src", frontMiiIconNormal.src)

            //ONLY then it works
            $(".mii-start-game").removeClass("disabled");
        } catch (error) {
            $(".mii-start-game").addClass("disabled");
            console.log("Error:", error);
            alert("Please upload valid Mii data/files!");
        }
    }

    var backMiiImg = new Image();
    var backMiiBody = new Image();
    var frontMiiImgNormal = new Image();
    var frontMiiImgBlink = new Image();
    var frontMiiImgHappy = new Image();
    var frontMiiIconNormal = new Image();

    var postAppMiiIconNormal = new Image();
    var postAppMiiIconHappy = new Image();
    var postAppMiiIconLike = new Image();
    var postAppMiiIconSurprised = new Image();
    var postAppMiiIconDisgust = new Image();
    var postAppMiiIconSorrow = new Image();

    var recordCount = 0;

    function preloadMiiRender() {
        frontMiiIconNormal.src = getRenderUrl(miiData.data, "face", 215, null, null);
        /*backMiiImg.src = getRenderUrl(miiData.data, "face_only", 512, null);*/
        backMiiBody.src = getRenderUrl(miiData.data, "all_body_sugar", 1024, "body_only", null);
        frontMiiImgNormal.src = getRenderUrl(miiData.data, "all_body_sugar", 1024, "body_inv_depth_mask", null);
        frontMiiImgBlink.src = getRenderUrl(miiData.data, "all_body_sugar", 1024, "body_inv_depth_mask", "blink");
        frontMiiImgHappy.src = getRenderUrl(miiData.data, "all_body_sugar", 1024, "body_inv_depth_mask", "surprise_open_mouth");
    }

    var blinkInterval = null;

    async function initializeNewClickingSession() {
        serverDataRequest.end = -1;
        serverDataRequest.score = -1;
        serverDataRequest.start = Date.now();

        $(".gameplay .mii-head.back").attr("src", backMiiImg.src)
        $(".gameplay .mii-head.front").attr("src", frontMiiImgNormal.src)
        $(".gameplay .mii-body").attr("src", backMiiBody.src)

        blinkInterval = setInterval(function () {
            var img = $(".gameplay .mii-head.front");
            img.attr("src", frontMiiImgBlink.src);
            setTimeout(function () {
                img.attr("src", frontMiiImgNormal.src);
            }, 150);
        }, 3000);


        $(".gameplay .mii-head.front").on("pointerdown", function () {
            audioMgr.playSfx("mii_click");
            $(".gameplay .mii-head.front").css("top", "-31px")
        })

        $(".gameplay .mii-head.front").on("pointerup pointercancel", function () {
            $(".gameplay .mii-head.front").css("top", "-51px")
            recordCount++;
            $(".click-hud").text(recordCount)
            gameTimer.reset();
        })

        $(".click-hud").text("-")
        $(".click-tleft").text("-")

        $(".select-mii").removeClass("active-screen")
        $(".gameplay").addClass("active-screen")
        window.scrollTo(0, 0);
        gameTimer.start();
    }

    var serverDataRequest = {
        score: -1,
        start: -1,
        end: -1,
    }

    function getServerDataForValidation() {
        var body = {
            record: serverDataRequest,
            meta: {
                mii_data: miiData.data,
                mii_name: localStorage.getItem("custom_mii_name")
            }
        }
        return btoa(unescape(encodeURIComponent(JSON.stringify(body))));
    }

    function getServerCompatibleComment(message, feelingId, isSpoiler) {
        var body = {
            message,
            feeling_id: feelingId,
            is_spoiler: isSpoiler
        }
        return btoa(unescape(encodeURIComponent(JSON.stringify(body))));
    }

    function sendRecordWithoutBlueskyPost(callback) {
        showLoadingIcon(true);
        var form = new FormData();
        form.append("validate", getServerDataForValidation());

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.open("POST", "/records", true);

        xhr.onload = function () {
            showLoadingIcon(false);
            if (xhr.status === 200) {
                // success
                callback(true);
                return;
            } else {
                alert("Failed to send record. Please try again.")
            }
            var needsReload = xhr.getResponseHeader("X-Needs-Reload");

            if (needsReload !== null) {
                return window.location.reload(true);
            }
            callback(false);
        };

        xhr.send(form);
    }

    function sendRecordWithBlueskyPost(message, feelingId, isSpoiler, callback) {
        var form = new FormData();
        form.append("validate", getServerDataForValidation());
        form.append("comment", getServerCompatibleComment(message, feelingId, isSpoiler))

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.open("POST", "/records", true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                // success
                callback(true);
                return;
            } else {
                try {
                    var a = JSON.parse(xhr.responseText)
                    if (a && a.error) {
                        switch (a.error) {
                            case "NOT_LOGGED_IN":
                            case "NO_AUTH_REFRESH_COOKIE":
                            case "BSKY_SESSION_MISSING":
                                alert("Your Bluesky session has expired.\n\nThe page will now reload.");
                                clearBlueskySession();
                                return;

                            default:
                                break;
                        }
                    }
                } catch (e) {
                }
                alert("Failed to send post/record. Please try again.\n\nYou might need to log out and log back in to Bluesky.")
            }
            var needsReload = xhr.getResponseHeader("X-Needs-Reload");

            if (needsReload !== null) {
                return window.location.reload(true);
            }
            callback(false);
        };

        xhr.send(form);
    }

    function showCelebration(recordCount) {
        // Hide all messages first
        $(".celebrate").hide();

        if (recordCount >= 1_000_000) {
            $(".holy-chud").show();
        } else if (recordCount >= 500_000) {
            $(".holy-shit3").show();
        } else if (recordCount >= 100_000) {
            $(".holy-shit2").show();
        } else if (recordCount >= 50_000) {
            $(".holy-shit").show();
        } else if (recordCount >= 10_000) {
            $(".woah").show();
        } else if (recordCount >= 5_000) {
            $(".wow").show();
        } else if (recordCount >= 1_000) {
            $(".good").show();
        } else if (recordCount >= 100) {
            $(".bad").show();
        } else {
            $(".lazy").show();
        }
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {
            var c = cookies[i];
            while (c.charAt(0) === " ") {
                c = c.substring(1, c.length);
            }

            if (c.indexOf(nameEQ) === 0) {
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
        }

        return null; // not found
    }


    function afterGameSessionEnds() {
        //gameTimer.stop();
        serverDataRequest.end = Date.now();
        serverDataRequest.score = recordCount;
        showCelebration(recordCount);

        if (!getCookie("bsky_session")) {
            $(".bsky-needs-login").show();
            $(".post-bsky-record").addClass("disabled");
        } else {
            $(".bsky-needs-login").hide();
            $(".post-bsky-record").removeClass("disabled");
        }

        $(".end-screen>h1>span").text(recordCount);
        recordCount = 0;
        clearInterval(blinkInterval);
        $(".gameplay .mii-head.front").off("pointerup pointercancel pointerdown")

        $(".gameplay").removeClass("active-screen")
        $(".end-screen").addClass("active-screen")
        window.scrollTo(0, 0);
    }

    async function trySavedMiiPreview() {
        var s = localStorage.getItem("mii_default");
        console.log("saved", s)
        if (s && s != null && s.length) {
            miiData.data = s;
            await tryRenderMiiSelectPreview();
        }
    }

    function showLoadingIcon(show) {
        if (show) {
            $(".loader-fixed").show();
        } else {
            $(".loader-fixed").hide();
        }
    }

    async function initializeClicker() {
        $(".loading-screen").addClass("active-screen");

        await audioMgr.loadTrack("bgm_olv", "../sfx/bgm_olv.mp3");
        await audioMgr.loadTrack("bgm_title", "../sfx/bgm_game.mp3");

        // sfx
        await audioMgr.loadTrack("back", "../sfx/back_button.wav", true);
        await audioMgr.loadTrack("select", "../sfx/clicking_button2.wav", true);
        await audioMgr.loadTrack("feeling", "../sfx/clicking_button.wav", true);
        await audioMgr.loadTrack("mii_1", "../sfx/mii_1.wav", true);
        await audioMgr.loadTrack("mii_2", "../sfx/mii_2.wav", true);
        await audioMgr.loadTrack("mii_click", "../sfx/mii_click.wav", true);
        await audioMgr.loadTrack("mii_saved", "../sfx/record.wav", true);
        await audioMgr.loadTrack("check", "../sfx/spoiler_check.wav", true);
        await audioMgr.loadTrack("uncheck", "../sfx/spoiler_uncheck.wav", true);
        await audioMgr.loadTrack("yeah", "../sfx/yeah.wav", true);

        if (getCookie("bsky_session")) {
            let info = JSON.parse(getCookie("bsky_session"));
            $(".bsky-loggedin p>span").text("@" + info.data.handle);
            $(".bsky-loggedin").show();
            $(".title-menu .link-bsky").hide();
            $(".bsky-why").hide();

            $(".bsky-link-screen").removeClass("active-screen");
            $(".title-screen").addClass("active-screen");
            window.scrollTo(0, 0);
        }

        audioMgr.playBgm("bgm_title", 0.1, true);
        if (audioMgr.audioCtx.state === "suspended") {
            document.addEventListener("click", resumeAudioContext, { once: true });
        }

        function resumeAudioContext() {
            audioMgr.audioCtx.resume().then(() => {
                console.log("AudioContext resumed!");

                // Only start BGM if nothing is playing yet
                if (!audioMgr.currentBgm) {
                    audioMgr.playBgm("bgm_title", 0.1, true);
                }
            });
        }

        const appHeight = () => document.documentElement.style.setProperty('--height', `${window.innerHeight}px`)
        window.addEventListener('resize', appHeight)
        appHeight()

        setTimeout(function () {
            $(".loading-screen").removeClass("active-screen");
            $(".title-screen").addClass("active-screen");
            window.scrollTo(0, 0);
        }, 0)
    }

    await initializeClicker();
});
