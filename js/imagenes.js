document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.getElementById("tratados-gallery");
    const btnTratados = document.getElementById("btn-tratados");
    const btnSeparadores = document.getElementById("btn-separadores");
    const btnStickers = document.getElementById("btn-stickers");

    const allButtons = [btnTratados, btnSeparadores, btnStickers];

    const loadAssets = () => {
        const fontLink = document.createElement("link");
        fontLink.href = "https://fonts.googleapis.com/css?family=Chewy&display=swap";
        fontLink.rel = "stylesheet";
        document.head.appendChild(fontLink);

        const faLink = document.createElement("link");
        faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
        faLink.rel = "stylesheet";
        document.head.appendChild(faLink);

        const style = document.createElement("style");
        style.innerHTML = `
            #image-modal {
                animation: fadeIn 0.3s ease;
            }
            #modal-img {
                opacity: 0;
                transform: scale(0.8);
                animation: zoomIn 0.3s ease forwards;
                border-radius: 15px;
                max-width: 80%;
                max-height: 80%;
                box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            }
            @keyframes fadeIn {
                from { background: rgba(0, 0, 0, 0); }
                to { background: rgba(0, 0, 0, 0.8); }
            }
            @keyframes zoomIn {
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            @keyframes fadeUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .fade-up {
                animation: fadeUp 0.5s ease forwards;
            }
            #close-modal-btn {
                position: absolute;
                top: 20px;
                right: 30px;
                background: transparent;
                border: none;
                font-size: 30px;
                color: white;
                cursor: pointer;
                z-index: 10000;
            }
            #download-modal-btn {
                position: absolute;
                top: 19px;
                right: 60px;
                color: white;
                border-radius: 6px;
                padding: 17px 10px;
                cursor: pointer;
                z-index: 10000;
                text-decoration: none;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: background-color 0.3s;
            }
            .btn-check + label {
                border-radius: 5% !important;
            }
        `;
        document.head.appendChild(style);
    };

    const createModal = () => {
        const modal = document.createElement("div");
        modal.id = "image-modal";
        modal.style.display = "none";
        modal.style.position = "fixed";
        modal.style.top = "0";
        modal.style.left = "0";
        modal.style.width = "100vw";
        modal.style.height = "100vh";
        modal.style.background = "rgba(0,0,0,0.8)";
        modal.style.justifyContent = "center";
        modal.style.alignItems = "center";
        modal.style.zIndex = "9999";
        modal.style.cursor = "pointer";
        modal.style.flexDirection = "column";
        modal.style.userSelect = "none";
        modal.style.display = "none";

        modal.innerHTML = `
            <button id="close-modal-btn" aria-label="Cerrar modal">&times;</button>
            <img id="modal-img" alt="Imagen ampliada" />
            <a id="download-modal-btn" href="#" download="" aria-label="Descargar imagen">
                <i class="fa-solid fa-download"></i>
            </a>
        `;

        document.body.appendChild(modal);

        const closeModal = () => {
            modal.style.display = "none";
            document.body.style.overflow = "";
        };

        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        modal.querySelector("#close-modal-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            closeModal();
        });
    };

    const setActiveButton = (activeBtn) => {
        allButtons.forEach(btn => btn.classList.remove("active"));
        activeBtn.classList.add("active");
    };

    const loadImages = (folder, count, extension = "jpg") => {
        gallery.innerHTML = "";

        for (let i = 1; i <= count; i++) {
            const col = document.createElement("div");
            col.className = "col-6 col-md-4 col-lg-3 d-flex justify-content-center fade-up";
            col.style.animationDelay = `${(i - 1) * 50}ms`;

            const imgContainer = document.createElement("div");
            imgContainer.style.position = "relative";
            imgContainer.style.display = "inline-block";

            const img = document.createElement("img");
            img.src = `src/images/${folder}/${i}.${extension}`;
            img.className = "img-fluid rounded shadow tratado-img";
            img.alt = `Image ${i}`;
            img.style.transition = "transform 0.2s";

            const downloadIcon = document.createElement("a");
            downloadIcon.href = img.src;
            downloadIcon.download = `Image_${folder}_${i}.${extension}`;
            downloadIcon.innerHTML = `<i class="fa-solid fa-download"></i>`;
            Object.assign(downloadIcon.style, {
                position: "absolute",
                top: "15px",
                right: "15px",
                fontSize: "20px",
                color: extension === "png" ? "#4786b0" : "#192938",
                transition: "transform 0.2s, color 0.2s",
                zIndex: "3",
                textDecoration: "none",
                pointerEvents: "auto"
            });

            downloadIcon.addEventListener("mouseenter", () => {
                downloadIcon.style.transform = "scale(1.2)";
            });

            downloadIcon.addEventListener("mouseleave", () => {
                downloadIcon.style.transform = "scale(1)";
            });

            img.addEventListener("mouseenter", () => {
                img.style.transform = "scale(1.05)";
            });

            img.addEventListener("mouseleave", () => {
                img.style.transform = "scale(1)";
            });

            img.addEventListener("click", () => {
                const modalImg = document.getElementById("modal-img");
                modalImg.src = img.src;
                modalImg.alt = img.alt;

                const modal = document.getElementById("image-modal");
                modal.style.display = "flex";
                document.body.style.overflow = "hidden";

                const downloadModalBtn = document.getElementById("download-modal-btn");
                downloadModalBtn.href = img.src;
                downloadModalBtn.download = `Image_${folder}_${i}.${extension}`;

                modalImg.style.animation = "none";
                void modalImg.offsetWidth;
                modalImg.style.animation = "zoomIn 0.3s ease forwards";
            });

            imgContainer.appendChild(img);
            imgContainer.appendChild(downloadIcon);
            col.appendChild(imgContainer);
            gallery.appendChild(col);
        }
    };

    // 🔁 NUEVA FUNCIÓN PARA PRECARGAR
    const preloadImages = (folder, count, extension = "jpg") => {
        for (let i = 1; i <= count; i++) {
            const img = new Image();
            img.src = `src/images/${folder}/${i}.${extension}`;
        }
    };

    // CARGA INICIAL
    loadAssets();
    createModal();
    loadImages("tratados", 15, "jpg"); // mostrar tratados al inicio
    setActiveButton(btnTratados);

    // 🔁 PRECARGA DE OTRAS CARPETAS
    preloadImages("separadores", 15, "jpg");
    preloadImages("stickers", 8, "png");

    // EVENTOS
    btnTratados.addEventListener("click", () => {
        loadImages("tratados", 15, "jpg");
        setActiveButton(btnTratados);
    });

    btnSeparadores.addEventListener("click", () => {
        loadImages("separadores", 15, "jpg");
        setActiveButton(btnSeparadores);
    });

    btnStickers.addEventListener("click", () => {
        loadImages("stickers", 8, "png");
        setActiveButton(btnStickers);
    });
});
