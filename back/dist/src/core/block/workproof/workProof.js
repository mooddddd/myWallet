"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WorkProof {
    constructor(proof) {
        this.proof = proof;
    }
    run(blockData, adjustmentBlock) {
        const props = {
            blockData,
            adjustmentBlock,
        };
        return this.proof.execute(props);
        // 인자값을 만들어준 다음 proof 안에 있는 excute 메서드를 실행시켜준다.
        // 밖에서 run 메서드만 사용해주면 ProofOfWork 안에 있는 메서드들이 모두 사용된다.
        // why? Proof는 ProofOfWork에 implements 되어 있으므로!!!
    }
}
exports.default = WorkProof;
