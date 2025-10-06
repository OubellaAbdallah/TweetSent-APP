```mermaid
graph TD
    A[Texte brut en entrée<br/>"Ce projet est incroyable !"] --> B{Tokenizer};
    B --> C["input_ids<br/>(Taille: 128)<br/>[101, 2023, 2622, 2003, ... , 102]"];
    B --> D["attention_mask<br/>(Taille: 128)<br/>[1, 1, 1, 1, ... , 0]"];

    subgraph "Modèle Keras 'model_1'"
        subgraph "Entrées"
            E[InputLayer: input_ids];
            F[InputLayer: attention_mask];
        end
        
        subgraph "Corps du Modèle (Fine-Tuning)"
            G[bert_layer_1<br/>(DistilBERT pré-entraîné)<br/>66M params];
        end

        subgraph "Tête de Classification"
            H[dense_1<br/>(Couche Dense)<br/>2307 params];
        end

        C --> E;
        D --> F;
        E --> G;
        F --> G;
        G -- "Vecteur de Contexte [CLS]<br/>(Taille: 768)" --> H;
    end

    H -- "Probabilités<br/>(Softmax)" --> I["Prédiction Finale<br/>[Neg: 0.01, Neu: 0.05, Pos: 0.94]"];
```
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style I fill:#9f9,stroke:#333,stroke-width:2px
